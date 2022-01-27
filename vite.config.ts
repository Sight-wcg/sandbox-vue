import path from 'path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'
import { getPackageInfo } from 'local-pkg'
import pkg from './package.json'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig(async () => {
  const repl = await getPackageInfo('@vue/repl')
  return {
    base:"/layui-vue-playground/",
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.REPL_VERSION': JSON.stringify(repl.version),
    },
    plugins: [
      vue({
        //reactivityTransform: `${pathSrc}/**/*`,
        reactivityTransform: true
      }),
      AutoImport({
        imports: ['vue', '@vueuse/core'],
        resolvers: [
           (name) => {
            if (name.match(/^Lay[A-Z]/)){
              return { 
                importName: name, 
                path: '@layui/layui-vue/lib/layui-vue.es.js',
                sideEffects:'@layui/layui-vue/lib/index.css',
              }
            }
          }
        ],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          // layui 自动按需加载解析
          (name) => {
            if (name.match(/^Lay[A-Z]/)){
              return { 
                importName: name, 
                path: '@layui/layui-vue/lib/layui-vue.es.js',
                sideEffects:'@layui/layui-vue/lib/index.css',
              }
            }
          }
        ],
      }),
      Unocss({
        presets: [presetUno()],
      }),
      Inspect(),
    ],
  }
})
