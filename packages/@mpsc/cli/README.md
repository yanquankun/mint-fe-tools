# mps-cli

## 小程序 ci 构建脚手架工具

- 提供小程序构建功能，降低矩阵或单独小程序构建时带来的人工成本

- 小程序多版本共同迭代时，体验版只能有一个，提测产生冲突，本工具将帮你生成本地版二维码

- 发布线上版时，提供分支校验保护规则，提供自动生成 tag 功能，并提供通知 hook，构建完成后，自动发布构建内容到通知群`可以是企微、邮件、美事等群，具体通知脚本由你自行定义`

- 构建流水线详见下面的

| 功能                           |                                               描述                                                |
| :----------------------------- | :-----------------------------------------------------------------------------------------------: |
| `生成本地版本`                 |                               多版本需求开发，提供本地版给 QA 测试                                |
| `构建分支限制`                 |                         生成环境下，防止随便推送代码，提供 ci 分支白名单                          |
| `本地预览码保存`               |                        生成的本地预览码直接保存到.mps/previewQrCode 目录中                        |
| `预览版二维码自动清空`         |               在下次构建前或者注册的自动构建任务执行前，自动清空上次的本地版二维码                |
| `本地预览版过期后自动生成功能` | 本地预览码过期后，自动生成新的本地预览码，执行 5 次，每次间隔 23min[微信小程序本地码有效期 25min] |
| `自动生成tag`                  |          生成环境下，通过 git 接口，以及参数选项，提供自动生成 Tag 功能，保留无污染代码           |
| `构建成功通知`                 |                                 构建后，支持发布构建信息到通知群                                  |

### test

- cmd `npm link`

### install

- cmd `npm i`

### publish

- 记得 update `package.json` version
- 在 lerna 根目录中执行 or 手动 npm publish

### install

- `npm i @mpsc/mps-cli -g` or `npm i @mpsc/mps-cli -D`

### mpsc command

![mpsc](https://www.yanquankun.com:9300/cdn/mpsc/mpsc%E6%8C%87%E4%BB%A4.png 'Magic Gardens')

- `所有指令请在与.mps同级目录进行操作`
- run `mpsc` or `mpsc -h` or `mpsc --help` 查看脚手架帮助
- run `mpsc --version|-V` 获取 mpsc 版本
- run `mpsc init` 将在你的 cmd 执行目录中创建 mpsc 配置目录

| 参数              |                                                                             说明                                                                             |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `-d` or `--debug` |                                                                开启初始化 mps 目录 debug 模式                                                                |
| `-f` or `--force` | 强制在当前目录初始化 cli 结构，强制会直接在当前目录安装。有可能你的项目是 monorepo 结构，虽然你可以给每个子包都安装 mpscli，但建议只维护一个 mpscli 配置目录 |
| `-l` or `--lbg`   |                                                                        使用 lbg 插件                                                                         |

- run `mpsc build` 将在你的 cmd 执行目录中构建小程序

| 参数              |           说明            |
| :---------------- | :-----------------------: |
| `-d` or `--debug` | 开启构建小程序 debug 模式 |

- run `mpsc clean` 删除 mpsc 配置目录
  | 参数 | 说明 |
  | :------------- | :----------------------------------: |
  | `-d` or `--debug` | 开启构建小程序 debug 模式 |
  | `-q` or `--qrcode` | 清除本地版二维码目录内容 |
  | `-s` or `--self` | 清除整个 mps 构建目录 |
- run `mpsc git` 获取 mps-cli 版本

### 原理图

![mps-cli工具流程图](https://www.yanquankun.com:9300/cdn/mpsc/mp-ci.png 'Magic Gardens')

### 构建效果图

![mps-cli构建效果图](https://www.yanquankun.com:9300/cdn/mpsc/%E7%94%9F%E4%BA%A7%E7%89%88%E9%80%9A%E7%9F%A5.png 'Magic Gardens')

![mps-cli构建效果图](https://www.yanquankun.com:9300/cdn/mpsc/%E6%9C%AC%E5%9C%B0%E7%89%88%E9%80%9A%E7%9F%A5.png 'Magic Gardens')
