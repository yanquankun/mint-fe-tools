const { isMpProject } = require('../tools/getProjectJson');
const _log = require('../utils/logger');
const cwd = process.cwd();

module.exports = (generator, { isDebug = false, force = false }) => {
  console.log('init get generator', generator, isDebug, force);
  const isMp = isMpProject(force, isDebug);
  if (!force && !isMp) {
    _log.error(
      '当前目录' + _log.chalk.yellow(cwd) + '不是小程序根项目，请在小程序根目录中执行mps init',
      'Init',
    );
    process.exit(1);
  }
};
