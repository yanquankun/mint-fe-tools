const execa = require('execa');
const _log = require('../utils/logger');
const inquirer = require('inquirer');
const file = require('../utils/file');
const cwd = process.cwd();

module.exports = async (generator, { isCleanSelf = false, isDebug = false }) => {
  const path = isCleanSelf ? `${cwd}/.mps` : `${cwd}/.mps/previewQrCode`;
  console.log(path);
  if (!file.isExitDir(path)) {
    _log.warn(
      `不存在 ${_log.chalk.red(
        isCleanSelf ? '.mps' : 'previewQrCode',
      )} 文件夹，请确认该目录是否存在`,
      'clean',
    );
    return;
  }

  try {
    if (isCleanSelf) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: '确定要删除mpscli配置目录吗？',
        },
      ]);
      if (!ok) {
        process.exit(1);
      }
    }

    try {
      execa.sync(`rm -rf ${isCleanSelf ? path : path + '/*'}`, {
        shell: true,
        stdio: 'inherit',
      });
    } catch (e) {
      isDebug && _log.error(e, 'clean');
    }

    _log.done(isCleanSelf ? '已删除mpscli配置目录' : '已清除previewQrCode目录', 'clean');
  } catch (error) {
    isDebug && _log.error(error, 'clean');
  }
};
