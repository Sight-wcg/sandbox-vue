import defaultAppTemplate from './defaultAppTemplate.vue?raw'
export interface DependencySource {
  // 依赖源名称
  name: string;
  // 依赖源链接
  url: string;
}

export interface Dependency {
  // 包名
  name: string;
  // 描述
  description?: string;
  // 版本
  version?: string;
  // 路径
  path: string;
  // 样式路径
  stylePath?: string;
  // 依赖源
  source?: DependencySource["name"];
}
export default {

}

export const config = {
  title: 'sandbox-vue',
  UIPackage: '@layui/layui-vue',
  //UIPackage: 'element-plus',
  minSupportedVersion: '0.2.5',
  filterPreRelease: false,
  defaultAppTemplate: defaultAppTemplate.trim()
}

export const dependencySources: DependencySource[] = [
  {
    name: 'unpkg',
    url: 'https://unpkg.com/',
  },
  {
    name: 'jsdelivr',
    url: 'https://cdn.jsdelivr.net/npm/',
  },
  {
    name: 'custom',
    url: 'import.meta.env.BASE_URL' + 'lib',
  },
]

export const dependencies: Dependency[] = [
  {
    name: '@vue/runtime-dom',
    version: '',
    path: '/dist/runtime-dom.esm-browser.js',
    stylePath: '',
    description: '',
    source: 'jsdelivr',
  },
  {
    name: '@vue/compiler-sfc',
    version: '',
    path: '/dist/compiler-sfc.esm-browser.js',
    stylePath: '',
    description: '编译 SFC 组件',
    source: 'jsdelivr',
  },
  {
    name: '@vue/shared',
    version: '',
    path: '/dist/shared.esm-bundler.js',
    stylePath: '',
    description: '',
    source: 'jsdelivr',
  },
  {
    name: '@layui/layui-vue',
    version: '',
    path: '/lib/index.js',
    stylePath: '/lib/index.css',
    description: 'layui-vue组件库',
    source: 'jsdelivr',
  },
  {
    name: '@layui/layer-vue',
    version: '',
    path: '/lib/layer-vue.es.min.js',
    stylePath: '',
    description: 'layer弹层',
    source: 'jsdelivr',
  },
  {
    name: 'element-plus',
    version: '',
    path: '/dist/index.full.mjs',
    stylePath: '/dist/index.css',
    description: 'element plus 组件库',
    source: 'unpkg',
  },
]
