const buildMpPrompt = require('../tools/buildPrompt');
const _log = require('../utils/logger');
// const { isObject } = require('../utils/type');
const isDebug = globalThis['buildDebug'] || false;

module.exports = async () => {
  const output = await buildMpPrompt(isDebug);
  _log.done('小程序构建完成', 'build');
  !output.isAtuoUpdateQrcode && process.exit(1);
  // isDebug &&
  //   _log.info(
  //     isObject(output) ? JSON.stringify(output) : 'prompt output is not object',
  //     'buildMpPrompt',
  //   );
};
