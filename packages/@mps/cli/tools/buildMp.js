// const isDebug = globalThis['buildDebug'] || false;
const _log = require('../utils/logger');
// const ci = require('miniprogram-ci');

module.exports = (answer) => {
  const { isAtuoUpdateQrcode } = answer;

  _log.done('小程序构建完成', 'build');
  !isAtuoUpdateQrcode && process.exit(1);
};
