# mps-cli

## 小程序 ci 构建脚手架工具

- 提供小程序构建功能，主要对矩阵小程序构建提效更多

- 小程序多版本共同迭代时，体验版只能有一个，提测产生冲突，本工具将帮你生成本地版二维码

- 发布线上版时，提供分支校验保护规则，提供自动生成 tag 功能

| 功能                           |                                 描述                                 |
| :----------------------------- | :------------------------------------------------------------------: |
| `生成本地版本`                 |                 多版本需求开发，提供本地版给 QA 测试                 |
| `构建分支限制`                 |                 防止随便推送代码，提供 ci 分支白名单                 |
| `本地预览码保存`               |                 生成的本地预览码直接保存到项目目录中                 |
| `预览版二维码自动清空`         | 在下次构建前或者注册的自动构建任务执行前，自动清空上次的本地版二维码 |
| `本地预览版过期后自动生成功能` |               本地预览码过期后，自动生成新的本地预览码               |
| `自动生成tag`                  |  通过 git 接口，以及参数选项，提供自动生成 Tag 功能，保留无污染代码  |

### test

- cmd `npm link`

### install

- cmd `npm i`

### publish TODO

- 记得 update `package.json` version
- 在 lerna 根目录中执行

### use

- `所有指令请在与.mps同级目录进行操作`
- run `mpsc` or `mpsc -h` or `mpsc --help` 查看脚手架帮助
- run `mpsc version` 获取 mpsc 版本
- run `mpsc init` 将在你的 cmd 执行目录中创建 mpsc 配置目录
- run `mpsc build` 将在你的 cmd 执行目录中构建小程序
- run `mpsc clean` 删除 mpsc 配置目录
- run `mpsc git` 获取 mps-cli 版本

### 原理图

![mps-cli工具流程图](https://www.yanquankun.com:9300/cdn/mpsc/mp-ci.png 'Magic Gardens')
