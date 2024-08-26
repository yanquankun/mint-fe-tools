const buildMpPrompt = require('../tools/buildMp');
const _log = require('../utils/logger');
// const { isObject } = require('../utils/type');

module.exports = async (generator, { isDebug = false }) => {
  await buildMpPrompt(isDebug);
  _log.done('小程序构建完成', 'build');
  // isDebug &&
  //   _log.info(
  //     isObject(output) ? JSON.stringify(output) : 'prompt output is not object',
  //     'buildMpPrompt',
  //   );
};
