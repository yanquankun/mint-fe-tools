# mps-cli

## 小程序 ci 构建脚手架工具

- 提供小程序构建功能，降低矩阵或单独小程序构建时带来的人工成本

- 小程序多版本共同迭代时，体验版只能有一个，提测产生冲突，本工具将帮你生成本地版二维码，并提供自动更新本地版二维码以及构建成功通知能力

- 发布线上版时，提供分支校验保护规则，提供自动生成 tag 功能，并提供通知 hook，构建完成后，自动发布构建内容到通知群`可以是企微、邮件、美事等群，具体通知脚本由你自行定义`

- `注意：小程序代码密钥需放在.mps/secrets目录中，命名格式：private.[appId].key`，后续将通过其他方式注入代码密钥，降低泄露风险

- 构建流水线详见最后流程图

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
- lerna or npm publish

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

| 参数              |                                                         说明                                                          |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------: |
| `-d` or `--debug` |                                               开启构建小程序 debug 模式                                               |
| `-l` or `--log`   | 开启日志记录模式，以提供错误信息进行排查，将记录日志到你的项目根目录写入[timestamp]\_mps.log 日志，请记得删除日志文件 |

- run `mpsc clean` 删除 mpsc 配置目录

| 参数               |           说明            |
| :----------------- | :-----------------------: |
| `-d` or `--debug`  | 开启构建小程序 debug 模式 |
| `-q` or `--qrcode` | 清除本地版二维码目录内容  |
| `-s` or `--self`   |   清除整个 mps 构建目录   |

- run `mpsc git` 获取本 cli 输出的一些 git 相关内容

### 配置目录说明

|--.mps ci 配置目录  
|----apps.json ci 配置文件  
|----secrets 小程序代码密钥目录  
|----hooks 构建期间执行的 hook  
|--------beforeBuild.js  
|--------beforeTaskBuild.js  
|--------afterBuild.js  
|--------afterTaskBuild.js  
|--------noticeTask.js  
|----previewQrCode 本地小程序构建后二维码目录

### apps.json 说明

|----weapps 配置项目中所有小程序的信息 Array  
|---------appName 小程序名称 必填  
|---------appId 小程序 Id 必填  
|---------key 小程序 key 非必填  
|---------projectPath 项目构建产物路径[`不填默认从 cmd 执行目录中查找 project.config.json，如你的小程序产物是在 dist 目录中，可设置为 dist`] 非必填  
|---------prePagePath 启动路径[不填则以微信规则为主] 非必填  
|----branchWhiteList 当发布为线上版的时候，需要在此列表中的分支才可发布[`不填默认 master`] 非必填  
|----manager 包管理工具[`脚手架会帮你自动注入`] 必填  
|----buildCommand 构建指令[`无需填写全部，如构建指令为 npm run build，则只需要填写 run 后的部分即可`] 必填

### Hooks

`Tip：需在.mps/hooks目录下建立对应[hook].js文件，否则该hook不生效`

`beforeBuild` 构建开始 hook

###### 需在工具目录中注册 beforeBuild.js

```javascript
/**
 * @desc 整个ci任务开始前执行的hook
 * @static 该hook必须实现beforeBuild方法
 */
function beforeBuild() {
  // do your beforeBuild hack
}

module.exports = {
  beforeBuild,
};
```

`afterBuild` 构建结束 hook

###### 需在工具目录中注册 afterBuild.js

```javascript
/**
 * @desc 整个ci任务开始结束后执行的hook
 * @static 该hook必须实现afterBuild方法
 */
function afterBuild() {
  // do your afterBuild hack
}

module.exports = {
  afterBuild,
};
```

`beforeTaskBuild` 构建任务执行前 hook

###### 单个小程序 ci 任务开始前执行的 hook，这在矩阵小程序中是很适合的，你可能需要对不同的矩阵小程序做不同的执行前操作,beforeTaskBuild.js

```javascript
/**
 * @desc 单个小程序ci任务开始前执行的hook，这在矩阵小程序中是很适合的，你可能需要对不同的矩阵小程序做不同的执行前操作
 * @static 该hook必须实现beforeTaskBuild方法
 */
// 注册你的通知逻辑
function beforeTaskBuild() {
  // do your beforeTaskBuild hack
}

module.exports = {
  beforeTaskBuild,
};
```

`afterTaskBuild` 构建任务执行后 hook

###### 单个小程序 ci 任务结束后执行的 hook，这在矩阵小程序中是很适合的，你可能需要对不同的矩阵小程序做不同的执行后操作需在工具目录中注册 afterTaskBuild.js

```javascript
/**
 * @desc 单个小程序ci任务结束后执行的hook，这在矩阵小程序中是很适合的，你可能需要对不同的矩阵小程序做不同的执行后操作
 * @static 该hook必须实现afterTaskBuild方法
 */
function afterTaskBuild() {
  // do your afterTaskBuild hack
}

module.exports = {
  afterTaskBuild,
};
```

`noticeTask` 构建通知 hook

###### 将该功能提为 hook 的原因是不同用户的通知场景不同，如钉钉、企微、美事等，将通知功能解耦，方便使用者按需配置，该 hook 必须实现如下方法

```javascript
// 注册你的通知逻辑
function noticeTask(buildInfo) {
  // do your notice
}
module.exports = {
  noticeTask,
};
```

```javascript
buildInfo {
    // 额外信息
    extraInfo: {
      user: String, // 提交者
      branch: String, // 分支
      reomte: String, // 远程地址,
      buildSuccessAppNames: String, // 构建的应用名称，多个名称通过,连接,
      tag: String // 生成gitTag
    },
    // 对应weapps中所配置的小程序生成的二维码信息
    qrcodeFiles:[{
        baseUrl: String, // 二维码地址，如果是本地版将生成base64图片地址否则提供微信小程序助手二维码供使用者查看体验版,
        fileName: String // 二维码文件名称
    }]
}
```

### 原理图

![mps-cli工具流程图](https://www.yanquankun.com:9300/cdn/mpsc/mp-ci.png 'Magic Gardens')

### 构建通知截图

![mps-cli构建效果图](https://www.yanquankun.com:9300/cdn/mpsc/%E7%94%9F%E4%BA%A7%E7%89%88%E9%80%9A%E7%9F%A5.png 'Magic Gardens')

![mps-cli构建效果图](https://www.yanquankun.com:9300/cdn/mpsc/%E6%9C%AC%E5%9C%B0%E7%89%88%E9%80%9A%E7%9F%A5.png 'Magic Gardens')
