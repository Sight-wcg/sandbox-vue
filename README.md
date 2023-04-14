# [sandbox-vue](https://layui-vue.gitee.io/sandbox-vue)
[![Netlify Status](https://api.netlify.com/api/v1/badges/93cdb381-e59d-4854-a3c3-9f994ad63688/deploy-status)](https://app.netlify.com/sites/sandbox-vue/deploys)

一个 Vue3 SFC 沙盒。[sandbox-vue](https://layui-vue.gitee.io/sandbox-vue)

### 快速开始

```
// 下载
git clone https://gitee.com/layui-vue/layui-vue-playground.git

// 安装依赖
npm install

// 运行
npm run dev

```

### 配置

```
 1. 配置基本信息和组件库依赖 src/config/sandbox.config.js

// 基本信息
export const config = {
  // 网站 title
  title: 'sandbox-vue',
  // UI 库包名
  UIPackage: '@layui/layui-vue',
  // 版本选择框显示的最小版本
  minSupportedVersion: '0.2.5',
  // 是否过滤预发布版本
  filterPreRelease: false,
  // APP.vue 内容模板
  defaultAppTemplate: defaultAppTemplate.trim()
}

// 依赖源
export interface DependencySource {
  // 依赖源名称
  name: string;
  // 依赖源链接
  url: string;
}

// 依赖
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

2. APP.vue 模板  /src/config/defaultAppTemplate.vue 

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>

```

> 下载功能需要自行修改 /src/download/template/\*\* 下的模板文件

### 部署静态站点

1. 构建应用

运行 `npm run build` 命令来执行应用的构建，默认情况下，构建会输出到 `dist` 文件夹中

```
npm run build
```

2. 本地测试应用

构建完成应用后，通过运行 `npm run preview` 命令，在本地测试该应用。

```
npm run build
npm run preview
```

3. github/gitee pages

在 `vite.config.js`中设置正确的 `base`。

如果要部署在 `https://<USERNAME>.github.io/` 上，可以省略 `base` 使其默认为 `'/'`。

如果要部署在 `https://<USERNAME>.github.io/<REPO>/` 上，例如仓库地址为` https://github.com/<USERNAME>/<REPO>`，那么需要设置 base 为 `'/<REPO>/'`。

### 感谢 
  - [element-plus-playground](https://github.com/element-plus/element-plus-playground)
  - [Vue SFC Playground](https://sfc.vuejs.org/)
  - [monaco-volar](https://github.com/Kingwl/monaco-volar)
