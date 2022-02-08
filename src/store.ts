import { reactive, watchEffect } from 'vue'
import { compileFile, File } from '@vue/repl'
import { genImportMap, genUnpkgLink, genVueLink } from './utils/dependency'
import { utoa, atou } from './utils/encode'
import type { Store, SFCOptions, StoreState, OutputModes } from '@vue/repl'

export type VersionKey = 'vue' | 'layuiVue'
export type Versions = Record<VersionKey, string>

const defaultMainFile = 'PlaygroundMain.vue'
const defaultAppFile = 'App.vue'
const LAYUI_VUE_FILE = 'layui-vue.js'

const mainCode = `
<script setup>
import App from './App.vue'
import { setupLayuiVue } from './${LAYUI_VUE_FILE}'
setupLayuiVue()
</script>
<template>
  <App />
</template>`.trim()

// 编辑区初始代码
const welcomeCode = `
<script setup lang="ts">
import { ref } from 'vue'

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
import Layui,{useLayer} from '@layui/layui-vue'

let installed = false

// 首先加载样式,防止页面闪烁
await loadStyle()

export function setupLayuiVue() {
  if(installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(Layui)
  instance.appContext.app.config.globalProperties.$layer = useLayer(instance.appContext) 
  installed = true
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

const isHidden = !import.meta.env.DEV

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
      files[defaultAppFile] = new File(defaultAppFile, welcomeCode)
    }

    files[defaultMainFile] = new File(defaultMainFile, mainCode, isHidden)
    this.state = reactive({
      mainFile: defaultMainFile,
      files,
      activeFile: files[defaultAppFile],
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
      isHidden
    )

    for (const file of Object.values(this.state.files)) {
      compileFile(this, file)
    }

    watchEffect(() => compileFile(this, this.state.activeFile))
  }

  setActive(filename: string) {
    const file = this.state.files[filename]
    if (file.hidden) return
    this.state.activeFile = this.state.files[filename]
  }

  addFile(fileOrFilename: string | File) {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    this.state.files[file.filename] = file
    this.setActive(file.filename)
  }

  deleteFile(filename: string) {
    if (filename === LAYUI_VUE_FILE) {
      alert("You cannot remove it, because layui-vue requires it.")
      return
    }
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.setActive(defaultAppFile)
      }
      delete this.state.files[filename]
    }
  }

  /**
   * remove default deps
   */
  private simplifyImportMaps() {
    const importMap = this.getImportMap()
    const dependencies = Object.keys(genImportMap({}))

    importMap.imports = Object.fromEntries(
      Object.entries(importMap.imports).filter(
        ([key]) => !dependencies.includes(key)
      )
    )
    return JSON.stringify(importMap)
  }

  serialize() {
    const data = JSON.stringify(
      Object.fromEntries(
       Object.entries(this.getFiles()).map(([file, content]) => {
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
    for (const file of Object.values(this.state.files)) {
      if (file.hidden) continue
      exported[file.filename] = file.code
    }
    return exported
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
