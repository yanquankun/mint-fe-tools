const { clack, ask } = require('../utils/terminal');
const _log = require('../utils/logger');
const { getProjectPackage, getMpsAppJson } = require('./getProjectJson');
const git = require('./git');
const buildMp = require('./buildMp');
const { checkVersion } = require('../utils/common');

module.exports = async () => {
  clack.intro('小程序构建');
  const defaultVersion = getProjectPackage(globalThis['buildDebug'] || false).version;
  const answer = {
    desc: await ask('text', {
      message: '输入版本描述',
      defaultValue: 'ci构建',
      placeholder: 'ci构建',
    }),
    version: await ask('text', {
      message: '输入版本号',
      defaultValue: defaultVersion,
      placeholder: defaultVersion,
      validate: (value) =>
        checkVersion(value || defaultVersion) ? undefined : '版本号格式应为 x、x.y 或 x.y.z',
    }),
    groupNotice: await ask('confirm', { message: '是否发送群通知？', initialValue: false }),
    isProd: await ask('confirm', { message: '是否为发布版本？', initialValue: false }),
    isAtuoUpdateQrcode: false,
    isCreateTag: false,
  };

  if (answer.isProd) {
    const branchWhiteList = getMpsAppJson().branchs || ['master'];
    const branch = await git.getBranch();
    if (!branchWhiteList.includes(branch)) {
      throw new Error(
        `当前分支 ${branch} 不在发布白名单中，请检查 .mps/apps.json 中的 branchs 字段`,
      );
    }
    answer.isCreateTag = await ask('confirm', { message: '是否打 tag？', initialValue: false });
  } else {
    answer.isAtuoUpdateQrcode = await ask('confirm', {
      message: '是否自动更新本地版二维码？',
      initialValue: false,
    });
  }

  await buildMp(answer);
  clack.outro('小程序构建完成');
  if (answer.isAtuoUpdateQrcode) {
    let remaining = 5;
    const update = () => {
      if (remaining-- <= 0) return;
      setTimeout(
        async () => {
          try {
            await buildMp(answer);
            update();
          } catch (error) {
            _log.error(error, '自动更新二维码');
            process.exitCode = 1;
          }
        },
        23 * 60 * 1000,
      );
    };
    update();
  }
};
