import path from 'path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import Mkcert from 'vite-plugin-mkcert'
import { getPackageInfo } from 'local-pkg'
import { LayuiVueResolver } from 'unplugin-vue-components/resolvers'
import pkg from './package.json'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig(async () => {
  const repl = await getPackageInfo('vue-repl-sight')
  return {
    base: '/sandbox-vue/',
    resolve: {
      alias: {
        '@': pathSrc,
        '@vue/repl': 'vue-repl-sight'
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.REPL_VERSION': JSON.stringify(repl.version),
    },
    server: {
      https: true,
      host: true,
    },
    worker: {
      format: 'es'
    },
    plugins: [
      vue({
        //reactivityTransform: `${pathSrc}/**/*`,
        reactivityTransform: true,
      }),
      AutoImport({
        // 自动导入 vue vueUse 相关函数
        imports: ['vue', '@vueuse/core'],
        // 自动导入 layer-vue 相关函数
        resolvers: [LayuiVueResolver()],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        // 自动解析 layui-vue 组件
        resolvers: [LayuiVueResolver({ resolveIcons: true })],
      }),
      Unocss({
        presets: [presetUno()],
      }),
      Mkcert(),
      Inspect(),
    ],
  }
})
