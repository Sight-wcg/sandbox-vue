#!/usr/bin/env sh

# 手动切换到 master 分支
# 发生错误时终止
set -e

# 构建
pnpm build

# 复制构建文件夹到上级目录
cp -avx ./dist ../

# 放弃所有更改(取消插件自动生成的 d.ts 文件更改)
git checkout .

# 切换到 page 分支
git checkout page

# 复制构建文件夹到 page 分支根目录
rm -rf ./dist
cp -avx ../dist ./
rm -rf ../dist

# 暂存所有更改
git add -A

# 提交
git commit -m '构建页面'

# 推送到远程 page 分支
git push -f origin page

cd -
