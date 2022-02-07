//TODO 待完善
const matchComponents = [
  {
    pattern: /^LaySelectOption$/,
    styleDir: 'select',
  },
]

export interface LayuiVueResolverOptions {
  /**
   * 将样式与组件一起导入
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * 解析 `layui-vue' 图标
   * requires package `@layui/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * 排除不需要自动导入的组件
   * @default []
   * 
   */
  exclude?: string[]
}

const esComponentsFolder = '@layui/layui-vue/es'

function lowerCamelCase(str: string){
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function getSideEffects(importName: string, options: LayuiVueResolverOptions){
  const { importStyle = true } = options

  if (!importStyle)return

  let styleDir = lowerCamelCase(importName.slice(3))// LayBackTop -> backTop
  for (const item of matchComponents) {
    if (item.pattern.test(importName)) {
      styleDir = item.styleDir
      break
    }
  }
  if(importStyle === 'less'){
    return `@layui/layui-vue/lib/index.less`
  }else {
    return `${esComponentsFolder}/${styleDir}/index.css`
  }
}

function resolveComponent(name: string, options: LayuiVueResolverOptions){
  if (!name.match(/^Lay[A-Z]/) || options?.exclude?.includes(name)) return

  if (options.resolveIcons && name.match(/[a-z]Icon$/)) {
    return {
      importName: name,
      path: `@layui/icons-vue`,
    }
  }

  return { 
    importName: name, 
    path: `@layui/layui-vue`,
    sideEffects: getSideEffects(name, options),
  }
}

export function LayuiVueResolver(options: LayuiVueResolverOptions){
  return {
    type: 'component',
    resolve: (name: string) => {
      return resolveComponent(name, options = {})
    }
  }
}