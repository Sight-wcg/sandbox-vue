import { reactive, watchEffect } from 'vue'
import { compileFile, File } from '@vue/repl'
import { genImportMap, genUnpkgLink, genVueLink } from './utils/dependency'
import { utoa, atou } from './utils/encode'
import type { Store, SFCOptions, StoreState, OutputModes } from '@vue/repl'

export type VersionKey = 'vue' | 'layuiVue'
export type Versions = Record<VersionKey, string>

const defaultMainFile = 'App.vue'
const LAYUI_VUE_FILE = 'layui-vue.js'

// 编辑区初始代码
const welcomeCode = `
<script setup lang="ts">
import { ref } from 'vue'
import { setupLayuiVue } from './${LAYUI_VUE_FILE}';
// setup for layui-vue, don't remove.
setupLayuiVue(); 

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <lay-input v-model="msg" style="width:350px"/>
</template>
`.trim()

// 全量引入 layui
const LayuiVueCode = (version: string) => `
import { getCurrentInstance } from 'vue'
import Layui from '@layui/layui-vue'

// 首先加载样式,防止页面抖动
await loadStyle()

export function setupLayuiVue() {
  const instance = getCurrentInstance()
  instance.appContext.app.use(Layui)
}

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
  	link.rel = 'stylesheet'
  	link.href = '${genUnpkgLink('@layui/layui-vue', version, '/lib/index.css')}'
    link.onload = resolve
    link.onerror = reject
  	document.body.appendChild(link)

    const style = document.createElement("style")
    style.type = 'text/css'
    style.innerHTML = 'body{margin:8px !important;}'
    document.head.appendChild(style)
  })
}
`

export class ReplStore implements Store {
  state: StoreState
  compiler!: typeof import('vue/compiler-sfc')
  options?: SFCOptions
  versions: Versions
  initialShowOutput = false
  initialOutputMode: OutputModes = 'preview'

  private pendingCompiler: Promise<typeof import('vue/compiler-sfc')> | null = null

  constructor({
    serializedState = '',
    versions = { vue: 'latest', layuiVue: 'latest' },
  }: {
    serializedState?: string
    versions?: Versions
  }) {
    let files: StoreState['files'] = {}
    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename of Object.keys(saved)) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      files = {
        [defaultMainFile]: new File(defaultMainFile, welcomeCode),
      }
    }

    let mainFile = defaultMainFile
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }
    this.state = reactive({
      mainFile,
      files,
      activeFile: files[mainFile],
      errors: [],
      vueRuntimeURL: '',
    })
    this.versions = versions

    this.initImportMap()
  }

  async init() {
    await this.setVueVersion(this.versions.vue)
    this.state.files[LAYUI_VUE_FILE] = new File(
      LAYUI_VUE_FILE,
      LayuiVueCode('latest').trim(),
      true
    )

    watchEffect(() => compileFile(this, this.state.activeFile))

    for (const file of Object.keys(this.state.files)) {
      if (file !== defaultMainFile) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename]
  }

  addFile(fileOrFilename: string | File) {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    this.state.files[file.filename] = file
    if (!file.hidden) this.setActive(file.filename)
  }

  deleteFile(filename: string) {
    if (filename === LAYUI_VUE_FILE) {
      alert("You cannot remove it, because layui-vue requires it.")
      return
    }
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.state.activeFile = this.state.files[this.state.mainFile]
      }
      delete this.state.files[filename]
    }
  }

  /**
   * remove default deps
   */
  private simplifyImportMaps() {
    const importMap = this.getImportMap()
    const depImportMap = genImportMap({})
    const depKeys = Object.keys(depImportMap)

    importMap.imports = Object.fromEntries(
      Object.entries(importMap.imports).filter(
        ([key]) => !depKeys.includes(key)
      )
    )
    return JSON.stringify(importMap)
  }

  serialize() {
    const data = JSON.stringify(
      Object.fromEntries(
        Object.entries(this.getFiles())
          .filter(([file]) => file !== LAYUI_VUE_FILE)
          .map(([file, content]) => {
            if (file === 'import-map.json') {
              try {
                const importMap = this.simplifyImportMaps()
                return [file, importMap]
              } catch {}
            }
            return [file, content]
          })
      )
    )

    return `#${utoa(data)}`
  }

  getFiles() {
    const exported: Record<string, string> = {}
    for (const filename of Object.keys(this.state.files)) {
      exported[filename] = this.state.files[filename].code
    }
    return exported
  }

  async setFiles(newFiles: Record<string, string>, mainFile = defaultMainFile) {
    const files: Record<string, File> = {}
    if (mainFile === defaultMainFile && !newFiles[mainFile]) {
      files[mainFile] = new File(mainFile, welcomeCode)
    }
    for (const [filename, file] of Object.entries(newFiles)) {
      files[filename] = new File(filename, file)
    }
    for (const file of Object.values(files)) {
      await compileFile(this, file)
    }
    this.state.mainFile = mainFile
    this.state.files = files
    this.initImportMap()
    this.setActive(mainFile)
  }

  private initImportMap() {
    if (!this.state.files['import-map.json']) {
      this.state.files['import-map.json'] = new File(
        'import-map.json',
        JSON.stringify({ imports: {} }, null, 2)
      )
    }
  }

  getImportMap() {
    try {
      return JSON.parse(this.state.files['import-map.json'].code)
    } catch (e) {
      this.state.errors = [
        `Syntax error in import-map.json: ${(e as Error).message}`,
      ]
      return {}
    }
  }

  setImportMap(map: {
    imports: Record<string, string>
    scopes?: Record<string, Record<string, string>>
  }) {
    this.state.files['import-map.json']!.code = JSON.stringify(map, null, 2)
  }

  private addDeps() {
    const importMap = this.getImportMap()
    importMap.imports = {
      ...importMap.imports,
      ...genImportMap({
        vue: this.versions.vue,
        layuiVue: this.versions.layuiVue,
      }),
    }
    this.setImportMap(importMap)
  }

  async setVersion(key: VersionKey, version: string) {
    switch (key) {
      case 'layuiVue':
        await this.setLayuiVueVersion(version)
        break
      case 'vue':
        await this.setVueVersion(version)
        break
    }
  }

  async setLayuiVueVersion(version: string) {
    this.versions.layuiVue = version
    this.addDeps()

    // eslint-disable-next-line no-console
    console.info(`[@layui/playground] Now using layui-vue version: ${version}`)
  }

  async setVueVersion(version: string) {
    const { compilerSfc, runtimeDom } = genVueLink(version)

    this.pendingCompiler = import(/* @vite-ignore */ compilerSfc)
    this.compiler = await this.pendingCompiler
    this.pendingCompiler = null
    this.state.vueRuntimeURL = runtimeDom
    this.versions.vue = version

    this.addDeps()

    // eslint-disable-next-line no-console
    console.info(`[@vue/repl] Now using Vue version: ${version}`)
  }
}
