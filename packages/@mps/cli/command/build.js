const buildMpPrompt = require('../tools/buildPrompt');
const _log = require('../utils/logger');
// const isDebug = globalThis['buildDebug'] || false;

module.exports = async () => {
  const output = await buildMpPrompt();
  _log.done('小程序构建完成', 'build');
  !output.isAtuoUpdateQrcode && process.exit(1);
};
