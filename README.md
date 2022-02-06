# layui-vue-playground

[layui-vue-playground: https://layui-vue.gitee.io/layui-vue-playground]( https://layui-vue.gitee.io/layui-vue-playground)

### 快速开始

1. 下载

`git clone https://gitee.com/layui-vue/layui-vue-playground.git`

2. 安装依赖

```
# pnpm
pnpm install 
# npm 
npm install
```

3. 运行

```
# pnpm
 pnpm dev
# npm
npm run dev
```

### 部署静态站点
以下以 pnpm 为例，npm 只需改为 npm run 即可

1. 构建应用

运行 `pnpm build` 命令来执行应用的构建，默认情况下，构建会输出到 dist 文件夹中
```
pnpm build
```

2. 本地测试应用
构建完成应用后，通过运行 `pnpm preview` 命令，在本地测试该应用。

```
pnpm build
pnpm preview
```

3. github/gitee pages

在 `vite.config.js`中设置正确的 `base`。

如果要部署在 `https://<USERNAME>.github.io/` 上，可以省略 `base` 使其默认为 `'/'`。

如果要部署在 `https://<USERNAME>.github.io/<REPO>/` 上，例如仓库地址为` https://github.com/<USERNAME>/<REPO>`，那么需要设置 base 为 `'/<REPO>/'`。