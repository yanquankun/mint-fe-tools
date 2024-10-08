const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const _log = require('../utils/logger');
const { getProjectPackage, getMpsAppJson } = require('./getProjectJson');
const git = require('./git');
const isDebug = globalThis['buildDebug'] || false;
const buildMp = require('./buildMp');
const { checkVersion } = require('../utils/common');

const buildMpPrompt = async () => {
  // 需要对外暴露的参数
  const answer = {
    // 版本描述
    desc: '',
    // 版本号
    version: '',
    // 是否配置群通知
    groupNotice: false,
    // 是否为发布版本
    isProd: false,
    // 是否生成本地版二维码
    // isCreateQrcode: false,
    // 是否注册自动更新预览版二维码
    isAtuoUpdateQrcode: false,
    // 是否打tag
    isCreateTag: false,
  };

  const basicOutput = await prompt([
    {
      name: 'desc',
      type: 'input',
      message: _log.chalk.bgBlue('输入版本描述'),
      filter: (val) => val || 'ci构建',
    },
    {
      name: 'version',
      type: 'input',
      message: _log.chalk.bgBlue(
        '输入版本号，格式为[x.[y.[z]]]，不填则以package.json的version字段为准',
      ),
      filter: (val) => {
        const version = val || getProjectPackage(isDebug).version;
        if (!checkVersion(version)) {
          console.log('');
          _log.error(`${version}不符合规范，格式为[x.[y.[z]]]`, 'buildPrompt');
          process.exit(1);
        }
        return version;
      },
    },
    {
      name: 'groupNotice',
      choices: [
        { name: '发送', value: true },
        { name: '不发送', value: false },
      ],
      type: 'rawlist',
      message: _log.chalk.bgBlue('请选择是否发送群通知'),
    },
    {
      name: 'isProd',
      choices: [
        { name: '是', value: true },
        { name: '否', value: false },
      ],
      type: 'rawlist',
      message: _log.chalk.bgBlue('请选择是否为发布版本'),
    },
  ]).then((answers) => {
    answer.desc = answers.desc;
    answer.version = answers.version;
    answer.groupNotice = answers.groupNotice;
    answer.isProd = answers.isProd;
    return answers;
  });

  // 生产版本流水线
  if (basicOutput.isProd) {
    const mpsJson = getMpsAppJson();
    const branchWhiteList = mpsJson.branchs || ['master'];
    const branch = await git.getBranch();

    if (!branchWhiteList.includes(branch)) {
      _log.error(
        `当前分支 ${_log.chalk.yellow(branch)} 不在白名单中，无法发布，请检查 ${_log.chalk.yellow(
          'apps.json',
        )} 中 ${_log.chalk.yellow('branchs')} 字段`,
        'buildMpPrompt',
      );
      process.exit(1);
    }

    const { isCreateTag } = await prompt([
      {
        name: 'isCreateTag',
        choices: [
          { name: '是', value: true },
          { name: '否', value: false },
        ],
        type: 'rawlist',
        message: _log.chalk.bgBlue('是否打tag'),
      },
    ]);
    answer.isCreateTag = isCreateTag;

    // 开始构建流程;
    buildMp(answer);
  }

  // 本地版本流水线
  if (!basicOutput.isProd) {
    // const { isCreateQrcode } = await prompt({
    //   name: 'isCreateQrcode',
    //   choices: [
    //     { name: '是', value: true },
    //     { name: '否', value: false },
    //   ],
    //   type: 'rawlist',
    //   message: _log.chalk.bgBlue('是否生成本地版二维码'),
    // });
    // answer.isCreateQrcode = isCreateQrcode;

    // if (isCreateQrcode) {
    await prompt({
      name: 'isAtuoUpdateQrcode',
      choices: [
        { name: '是', value: true },
        { name: '否', value: false },
      ],
      type: 'rawlist',
      message: _log.chalk.bgBlue('是否自动更新本地版二维码'),
    }).then((res) => {
      const { isAtuoUpdateQrcode } = res;
      if (isAtuoUpdateQrcode) {
        answer.isAtuoUpdateQrcode = true;
        _log.info('注册自动更新逻辑', 'buildMpPrompt');
        let count = 5;
        const autoUpdate = function () {
          count-- > 0 &&
            setTimeout(() => {
              autoUpdate();
              buildMp(answer);
            }, 23 * 60 * 1000);
        };
        autoUpdate();
      }
    });
    // }

    // 开始构建流程
    buildMp(answer);
  }
};

module.exports = buildMpPrompt;
