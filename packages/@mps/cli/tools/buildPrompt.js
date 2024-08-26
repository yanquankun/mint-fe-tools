const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const _log = require('../utils/logger');
const { getProjectPackage, getMpsAppJson } = require('./getProjectJson');
const git = require('./git');

const buildMpPrompt = async (isDebug = false) => {
  // 需要对外暴露的参数
  const output = {
    // 是否注册自动登录
    isAtuoUpdateQrcode: false,
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
  ]);

  // 生产版本流水线
  if (basicOutput.isProd) {
    const mpsJson = getMpsAppJson();
    const branchWhiteList = mpsJson.branches || ['master'];
    const branch = await git.getBranch();

    if (!branchWhiteList.includes(branch)) {
      _log.error(`当前分支 ${branch} 不在白名单中，无法发布`, 'buildMpPrompt');
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
    console.log(isCreateTag);

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

    console.log(isCreateQrcode);
    // 开始构建流程
  }

  return output;
};

module.exports = buildMpPrompt;
