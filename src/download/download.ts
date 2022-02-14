import { saveAs } from 'file-saver'
import { defaultMainFile, LAYUI_VUE_FILE } from '../store'

import index from './template/index.html?raw'
import main from './template/main.ts?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import tsconfig from './template/tsconfig.json?raw'


export async function downloadProject(store: any) {
/*   if (!confirm('Download example project files?')) {
    return
  } */

  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  const excludeFiles = [defaultMainFile, LAYUI_VUE_FILE, 'import-map.json']

  // basic structure
  zip.file('index.html', index)
  zip.file('package.json', pkg)
  zip.file('tsconfig.json', tsconfig)
  zip.file('vite.config.js', config)
  zip.file('README.md', readme)
 

  // project src
  const src = zip.folder('src')!
  src.file('main.ts', main)

  const files = store.getFiles()
  for (const file in files) {
    if (excludeFiles.includes(file)) continue
    src.file(file, files[file])
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'layui-vue-example-project.zip')
}