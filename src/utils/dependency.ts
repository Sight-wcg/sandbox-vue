import { compare } from 'compare-versions'
import type { Versions } from 'src/store'
import type { Ref } from 'vue'

/**
 * 
 * @param pkg 包名
 * @param version 版本
 * @param path 路径
 * @returns unpkg CDN 链接
 */
export const genUnpkgLink = (
  pkg: string,
  version: string | undefined,
  path: string
) => {
  version = version ? `@${version}` : ''
  return `https://unpkg.com/${pkg}${version}${path}`
}

/**
 * 
 * @param pkg 包名
 * @param version 版本
 * @param path 路径
 * @returns Jsdelivr CDN 链接
 */
export const genJsdelivrLink = (
  pkg: string,
  version: string | undefined,
  path: string
) => {
  version = version ? `@${version}` : ''
  return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
}

/**
 * 获取 Vue 版本链接
 * @param version 版本
 * @returns 
 */
export const genVueLink = (version: string) => {
  const compilerSfc = genUnpkgLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js'
  )
  const runtimeDom = genUnpkgLink(
    '@vue/runtime-dom',
    version,
    '/dist/runtime-dom.esm-browser.js'
  )
  return {
    compilerSfc,
    runtimeDom,
  }
}

// 生成 importMap
export const genImportMap = ({ vue, layuiVue }: Partial<Versions> = {}) => {
  interface Dependency {
    pkg?: string
    version?: string
    path: string
    source?: 'unpkg' | 'jsdelivr'
  }
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: '@vue/runtime-dom',
      version: vue,
      path: '/dist/runtime-dom.esm-browser.js',
      source: 'jsdelivr',
    },
    '@vue/shared': {
      version: vue,
      path: '/dist/shared.esm-bundler.js',
      source: 'jsdelivr',
    },
    '@layui/layui-vue': {
      version: layuiVue,
      path: '/lib/layui-vue.es.min.js',
      source: 'jsdelivr',
    }
  }

  return Object.fromEntries(
    Object.entries(deps).map(([key, dep]) => [
      key,
      (dep.source === 'unpkg' ? genUnpkgLink : genJsdelivrLink)(
        dep.pkg ?? key,
        dep.version,
        dep.path
      ),
    ])
  )
}

// 获取版本
export const getVersions = (pkg: string) =>
  useFetch(`https://data.jsdelivr.com/v1/package/npm/${pkg}`, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
  }).json<string[]>().data as Ref<string[]>

// 获取 Vue 版本
export const getSupportedVueVersions = () => {
  let versions = $(getVersions('vue'))
  return computed(() =>
    versions.filter((version) => compare(version, '3.2.0', '>='))
  )
}

// 获取 layui-vue 版本
export const getSupportedLayuiVueVersions = () => {
  let versions = $(getVersions('@layui/layui-vue'))
  return computed(() =>{
    // 如果最新版本是预发布版本，则显示最新版的所有预发布版本,否则过滤掉预发布版本
    if(versions.length === 0)return[]
    const layuiVersions = versions.filter((version) => compare(version, '0.2.5', '>='))
    const filteredVersions: string[] = []
    let isInPreRelease = layuiVersions[0].includes('-')
    for (const v of layuiVersions) {
      if (v.includes('-')) {
        if (isInPreRelease) {
          filteredVersions.push(v)
        }
      } else {
        filteredVersions.push(v)
        isInPreRelease = false
      }
      if (filteredVersions.length >= 20) {
        break
      }
    }
    return filteredVersions;
  }
  )
}
