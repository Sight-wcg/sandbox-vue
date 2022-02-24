import { compare } from 'compare-versions'
import type { Versions } from 'src/store'
import type { Ref } from 'vue'

import { dependencies, dependencySources, config as config } from '../config/sandbox.config'

/**
 * 获取依赖源,默认第一个
 * @param sourceName 源名称
 * @returns 源信息
 */
const getDependencySources = (sourceName?: string) => {
  return dependencySources.find((depSource) => depSource.name === sourceName)
    ?? dependencySources[0]
}

/**
 * 获取指定包信息
 * @param pkg 包名
 * @returns 包信息
 */
const getPackageInfo = (pkg: string) => {
  return dependencies.find((dep) => dep.name === pkg)
}
/**
 * 
 * @param pkg 包名
 * @param pkgVersion 版本
 * @param isStyle 是否获取样式路径
 * @returns 生成的链接
 */
export const genLink = (pkg: string, pkgVersion?: string, isStyle?: boolean) => {
  const packageInfo = getPackageInfo(pkg);
  if (!packageInfo) return;
  let { name: pkgName, version, path, stylePath, source } = packageInfo;
  version = version ? `@${version}` : ''
  version = pkgVersion ? `@${pkgVersion}` : version
  const dependencySource = getDependencySources(source)
  return `${dependencySource.url}${pkgName}${version}${isStyle ? stylePath : path}`
}

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
 * 生成 Vue 链接
 * @param version 版本
 * @returns 
 */
export const genVueLink = (version: string) => {
  const compilerSfc = genLink(
    '@vue/compiler-sfc',
    version,
  )
  const runtimeDom = genLink(
    '@vue/runtime-dom',
    version,
  )
  return {
    compilerSfc,
    runtimeDom,
  }
}

// 生成 importMap
export const genImportMap = ({ vue, UILib }: Partial<Versions> = {}) => {
  const deps: any = []
  dependencies.forEach((dep, index) => {
    if (dep.name.startsWith('@vue')) {
      if (dep.name === '@vue/runtime-dom') {
        deps[index] = ['vue', genLink(dep.name, vue)]
      } else {
        deps[index] = [dep.name, genLink(dep.name, vue)]
      }
    } else if (dep.name === config.UIPackage) {
      deps[index] = [dep.name, genLink(dep.name, UILib)]
    } else {
      deps[index] = [dep.name, genLink(dep.name)]
    }

  })
  return Object.fromEntries(deps)
}

// 获取版本
export const getVersions = (pkg: string) =>
  useFetch(`https://data.jsdelivr.com/v1/package/npm/${pkg}`, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
  }).json<string[]>().data as Ref<string[]>

// 获取支持的版本
export const getSupportedVersions = (pkg: string, minSupportedVersion: string, filterPreRelease?: boolean) => {
  let versions = $(getVersions(pkg))
  return computed(() => {
    if (versions.length === 0) return []
    let supportedVersions = versions.filter((version) => compare(version, minSupportedVersion, '>='))
    // 如果最新版本是预发布版本，则显示最新版的所有预发布版本,否则过滤掉预发布版本
    if (filterPreRelease) {
      const filteredVersions: string[] = []
      let isInPreRelease = supportedVersions[0].includes('-')
      for (const v of supportedVersions) {
        if (v.includes('-')) {
          if (isInPreRelease) {
            filteredVersions.push(v)
          }
        } else {
          filteredVersions.push(v)
          isInPreRelease = false
        }
        if (filteredVersions.length >= 30) {
          break
        }
      }
      supportedVersions = filteredVersions;
    }
    return supportedVersions
  })
}

// 获取 Vue 版本
export const getSupportedVueVersions = () => {
  let versions = $(getVersions('vue'))
  return computed(() =>
    versions.filter((version) => compare(version, '3.2.0', '>='))
  )
}
