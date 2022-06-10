import { reactive, watchEffect } from 'vue'
import { compileFile, File } from '@vue/repl'
import { genImportMap, genLink, genVueLink } from './utils/dependency'
import { utoa, atou } from './utils/encode'
import type { Store, SFCOptions, StoreState, OutputModes } from '@vue/repl'

import { config } from './config/sandbox.config'

export type VersionKey = 'vue' | 'UILib'
export type Versions = Record<VersionKey, string>

export const preferSFC = ref(true);
export const UIPackage = ref<string>(config.UIPackage)
export const defaultHTMLFile = 'index.html'
export const defaultMainFile = 'PlaygroundMain.vue'
export const defaultAppFile = 'App.vue'
export const LIB_INSTALL_FILE =  preferSFC.value ? 'LibInstall.js' : UIPackage.value + ".js"

// PlaygroundMain.vue
const mainCode = `
<script setup>
import App from './App.vue'
import { setupLib } from './${LIB_INSTALL_FILE}'
setupLib()
</script>
<template>
  <App />
</template>`.trim()

// App.vue
const defaultAppFileTemplate = config.defaultAppTemplate ?? `
<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" style="width:350px"/>
</template>
`.trim()

// 全量引入 layui
const LibInstallFileCode = (version: string) => preferSFC.value 
? `
import { getCurrentInstance } from 'vue'
import UILibName from '${UIPackage.value}'

let installed = false

await loadStyle()

export function setupLib() {
  if(installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(UILibName)
  installed = true
}

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
  	link.rel = 'stylesheet'
  	link.href = '${genLink(UIPackage.value, version, true)}'
    link.onload = resolve
    link.onerror = reject
  	document.head.appendChild(link)

    const style = document.createElement("style")
    style.type = 'text/css'
    style.innerHTML = 'body{margin:8px !important;}'
    document.head.appendChild(style)
  })
}
` 
: `
await loadStyle()
await loadLib()

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
  	link.rel = 'stylesheet'
  	link.href = '${genLink(UIPackage.value, version, true)}'
    link.onload = resolve
    link.onerror = reject
  	document.head.appendChild(link)

    const style = document.createElement("style")
    style.type = 'text/css'
    style.innerHTML = 'body{margin:8px !important;}'
    document.head.appendChild(style)
  })
}

export function loadLib() {
  const $libID = document.querySelector('#lib-id')
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = "lib-id"
  	script.src = '${genLink(UIPackage.value, version)}'
    script.onload = resolve
    script.onerror = reject
  	document.body.appendChild(script)
  })
}
`

const defaultHTMLFileCode = `
<div>
  <button type="button" class="layui-btn">默认按钮</button>
</div>
<script type='module'>
import './${LIB_INSTALL_FILE}'

const { layer } = layui

layer.msg('layui version:' + layui.v, { time: 3000 })
</script>
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

  // 默认不设置版本
  constructor({
    serializedState = '',
    versions = { vue: '', UILib: '' },
  }: {
    serializedState?: string
    versions?: Versions
  }) {
    let files: StoreState['files'] = {}
    // FIXME 临时的兼容方法
    if(window.location.search.includes("deps=layui")){
      preferSFC.value = false
      UIPackage.value = "layui"
    }
    
    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename of Object.keys(saved)) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      if(preferSFC.value){
        files[defaultAppFile] = new File(defaultAppFile, defaultAppFileTemplate)
      }else{
        files[defaultHTMLFile] = new File(defaultHTMLFile, defaultHTMLFileCode.trim())
      }  
    }

    if(preferSFC.value){
      files[defaultMainFile] = new File(defaultMainFile, mainCode, isHidden)
    }
    this.state = reactive({
      mainFile: preferSFC.value ? defaultMainFile : defaultHTMLFile,
      files,
      activeFile: preferSFC.value ? files[defaultAppFile] : files[defaultHTMLFile],
      errors: [],
      vueRuntimeURL: '',
    })
    this.versions = versions

    this.initImportMap()
  }

  async init() {
    await this.setVueVersion(this.versions.vue)
    this.state.files[LIB_INSTALL_FILE] = new File(
      LIB_INSTALL_FILE,
      LibInstallFileCode('').trim(),
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
    if (filename === LIB_INSTALL_FILE || filename === defaultMainFile || filename === defaultHTMLFile) {
      alert(`You cannot remove it, because ${UIPackage.value} requires it.`)
      return
    }
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        if(preferSFC.value){
          this.setActive(defaultAppFile)
        }else{
          this.setActive(defaultHTMLFile)
        }
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
            } catch { }
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
        UILib: this.versions.UILib,
      }),
    }
    this.setImportMap(importMap)
  }

  async setVersion(key: VersionKey, version: string) {
    switch (key) {
      case 'UILib':
        await this.setUILibVersion(version)
        break
      case 'vue':
        await this.setVueVersion(version)
        break
    }
  }

  async setUILibVersion(version: string) {
    this.state.files[LIB_INSTALL_FILE].code = LibInstallFileCode(version).trim() // 更新版本重新编译所有文件
    for (const file of Object.values(this.state.files)) {
      compileFile(this, file)
    }
    this.versions.UILib = version
    this.addDeps()

    // eslint-disable-next-line no-console
    console.info(`[${UIPackage.value}/playground] Now using ${UIPackage.value} version: ${version}`)
  }

  async setVueVersion(version: string) {
    const { compilerSfc, runtimeDom } = genVueLink(version)
    if (!compilerSfc || !runtimeDom) return
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
