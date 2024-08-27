const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const _log = require('../utils/logger');
const { getProjectPackage, getMpsAppJson } = require('./getProjectJson');
const git = require('./git');
const isDebug = globalThis['buildDebug'] || false;

const buildMpPrompt = async () => {
  // 需要对外暴露的参数
  const output = {
    // 版本描述
    desc: '',
    // 版本号
    version: '',
    // 是否配置群通知
    groupNotice: false,
    // 是否生成本地版二维码
    isCreateQrcode: false,
    // 是否注册自动登录
    isAtuoUpdateQrcode: false,
    // 是否打tag
    isCreateTag: false,
  };

  const basicOutput = await prompt([
    {
      name: 'desc',
      type: 'input',
      message: _log.chalk.bgBlue('输入版本描述'),
      filter: (val) => val || '',
    },
    {
      name: 'version',
      type: 'input',
      message: _log.chalk.bgBlue(
        '输入版本号，格式为[x.[y.[z]]]，不填则以package.json的version字段为准',
      ),
      filter: (val) => val || getProjectPackage(isDebug).version,
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
    output.desc = answers.desc;
    output.version = answers.version;
    output.groupNotice = answers.groupNotice;
    return answers;
  });

  // 生产版本流水线
  if (basicOutput.isProd) {
    const mpsJson = getMpsAppJson();
    const branchWhiteList = mpsJson.branches || ['master'];
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
    output.isCreateTag = isCreateTag;

    // 开始构建流程
  }

  // 本地版本流水线
  if (!basicOutput.isProd) {
    const { isCreateQrcode } = await prompt({
      name: 'isCreateQrcode',
      choices: [
        { name: '是', value: true },
        { name: '否', value: false },
      ],
      type: 'rawlist',
      message: _log.chalk.bgBlue('是否生成本地版二维码'),
    });
    output.isCreateQrcode = isCreateQrcode;

    isCreateQrcode &&
      (await prompt({
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
          output.isAtuoUpdateQrcode = true;
          _log.info('注册自动更新逻辑', 'buildMpPrompt');
          setInterval(() => {
            console.log('注册自动更新逻辑');
          }, 5 * 1000);
        }
        // 开始构建流程
        return;
      }));

    // 开始构建流程
  }

  return output;
};

module.exports = buildMpPrompt;
