const inquirer = require('inquirer');
const prompt = inquirer.prompt;
const _log = require('../utils/logger');
const { getProjectPackage, getMpsAppJson } = require('../tools/getProjectJson');
const git = require('../tools/git');

const buildMpPrompt = async (isDebug = false) => {
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
  console.log(basicOutput);
  // 生产版本流水线
  if (basicOutput.isProd) {
    const mpsJson = getMpsAppJson();

    const branchWhiteList = mpsJson.branches || ['master'];
    const branch = await git.getBranch();

    if (!branchWhiteList.includes(branch)) {
      _log.error(`当前分支 ${branch} 不在白名单中，无法发布`, 'buildMpPrompt');
      process.exit(1);
    }
  }
  // 本地版本流水线
  //   if (!basicOutput.isProd) {
  //   }
};

module.exports = buildMpPrompt;
