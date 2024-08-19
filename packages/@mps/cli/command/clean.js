const execa = require('execa');
const _log = require('../utils/logger');
const inquirer = require('inquirer');

const cwd = process.cwd();
module.exports = async (generator, { isCleanSelf = false, isDebug = false }) => {
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
      execa.sync(isCleanSelf ? `rm -rf ${cwd}/.mps` : `rm -rf ${cwd}/.mps/previewQrCode/*`, {
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
