/**
 * Layui Vue Resolver
 * √ On-demand import components for @layui/layui-vue
 * √ component and style resolver for @layui/icons-vue
 * On-demand import style
 * layer
 */
// TODO 待 css 完善
const matchComponents = [
  {
    pattern: /^LayAvatarList$/,
    styleDir: 'avatar',
  },
  {
    pattern: /^(LayBreadcrumb|LayBreadcrumbItem)$/,
    styleDir: '',
  },
  {
    pattern: /^(LayCarousel|LayCarouselItem)$/,
    styleDir: '',
  },
  {
    pattern: /^(LayCheckbox|LayCheckboxGroup)$/,
    styleDir: '',
  },
  {
    pattern: /^LayCol$/,
    styleDir: '',
  },
  {
    pattern: /^(LayCollapse|LayCollapseItem)$/,
    styleDir: '',
  },
  {
    pattern: /^LayColorPicker$/,
    styleDir: '',
  },
  {
    pattern: /^LayCountUp$/,
    styleDir: '',
  },
  {
    pattern: /^(LayDropdown|LayDropdownItem)$/,
    styleDir: '',
  },
  {
    pattern: /^LayField$/,
    styleDir: '',
  },
  {
    pattern: /^(LayForm|LayFormItem)$/,
    styleDir: 'formitem',
  },
  {
    pattern: /^LayHeader$/,
    styleDir: '',
  },
  {
    pattern: /^LayIcon$/,
    styleDir: '',
  },
  {
    pattern: /^LayInput$/,
    styleDir: '',
  },
  {
    pattern: /^LayLayer$/,
    styleDir: '',
  },
  {
    pattern: /^LayLine$/,
    styleDir: '',
  },
  {
    pattern: /^LayLogo$/,
    styleDir: '',
  },
  {
    pattern: /^(LayMenuItem|LaySubMenu)$/,
    styleDir: 'menu',
  },
  {
    pattern: /^LayPage$/,
    styleDir: '',
  },
  {
    pattern: /^LayProgress$/,
    styleDir: '',
  },
  {
    pattern: /^LayRadio$/,
    styleDir: '',
  },
  {
    pattern: /^LayScroll$/,
    styleDir: '',
  },
  {
    pattern: /^LaySelectOption$/,
    styleDir: 'select',
  },
  {
    pattern: /^LaySkeletonItem$/,
    styleDir: 'skeleton',
  },
  {
    pattern: /^LaySplitPanelItem$/,
    styleDir: 'splitPanel',
  },
  {
    pattern: /^LayStepItem$/,
    styleDir: 'step',
  },
  {
    pattern: /^LaySwitch$/,
    styleDir: '',
  },
  {
    pattern: /^(LayTab|LayTabItem)$/,
    styleDir: '',
  },
  {
    pattern: /^LayTextarea$/,
    styleDir: '',
  },
  {
    pattern: /^LayTimelineItem$/,
    styleDir: 'timeline',
  },
]

export interface LayuiVueResolverOptions {
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'less'

  /**
   * resolve `@layui/layui-vue' icons
   * requires package `@layui/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean

  /**
   * exclude components that do not require automatic import
   * @default []
   * 
   */
  exclude?: string[]
}

const esComponentsFolder = '@layui/layui-vue/es'
const iconsRe = /^([A-Z][\w]+Icon|LayIcon)$/

function lowerCamelCase(str: string){
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function getSideEffects(importName: string, options: LayuiVueResolverOptions){
  const { importStyle = true } = options

  if (!importStyle)return

  if(options.resolveIcons && importName.match(iconsRe)){
    return `@layui/icons-vue/lib/index.css`
  }

  let styleDir = lowerCamelCase(importName.slice(3))// LayBackTop -> backTop
  for (const item of matchComponents) {
    if (item.pattern.test(importName)) {
      styleDir = item.styleDir
      break
    }
  }
  // FIXME 临时方案,部分组件样式未拆分,待 css 重新梳理后删除
  if(!styleDir) {
    return `${esComponentsFolder}/index/index.css`
  }

  if(importStyle === 'less'){
    return `@layui/layui-vue/lib/index.less`
  }else {
    return [
      `${esComponentsFolder}/index/index.css`,
    ]
    // TODO 待 css 重新梳理后启用
    // return `${esComponentsFolder}/${styleDir}/index.css`
  }
}

// TODO layer,useLayer 自动导入


function resolveComponent(name: string, options: LayuiVueResolverOptions){
  if (!name.match(/^Lay[A-Z]/) || options?.exclude?.includes(name)) return
  
  if (options.resolveIcons && name.match(iconsRe)) {
    return {
      importName: name,
      path: `@layui/icons-vue`,
      sideEffects: getSideEffects(name, options)
    }
  }

  return { 
    importName: name, 
    path: `@layui/layui-vue`,
    sideEffects: getSideEffects(name, options),
  }
}

/**
 * Resolver for layui-vue
 * Requires @layui/layui-vue@v0.3.6 or later
 * @param options 
 * @returns 
 */
export function LayuiVueResolver(options: LayuiVueResolverOptions = {}){
  return {
    type: 'component',
    resolve: (name: string) => {
      return resolveComponent(name, options)
    }
  }
}