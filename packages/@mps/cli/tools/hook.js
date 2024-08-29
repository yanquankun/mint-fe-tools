const hooks = ['beforeBuild', 'afterBuild', 'beforeTaskBuild', 'afterTaskBuild', 'noticeTask'];
const _log = require('../utils/logger');
const path = require('path');
const { isExitFile } = require('../utils/file');
const { isFunction } = require('../utils/type');
const { loadProjectModule } = require('../lib/module');

const callHook = async (hook, options) => {
  if (!hooks.includes(hook)) _log.warn(`hook ${hook} 不合法`, 'callHook');

  const hookPath = path.join(process.cwd(), `.mps/hooks/${hook}.js`);
  if (isExitFile(hookPath)) {
    const module = await loadProjectModule(hookPath);
    if (!module[hook] || !isFunction(module[hook])) {
      _log.error(
        `${_log.chalk.yellow(hook + '.js')} 需要实现 ${_log.chalk.yellow(
          hook,
        )} Function，该hook本次执行失败，但构建任务仍将继续`,
        'callHook',
      );
    }
    isFunction(module[hook]) && module[hook].call(null, options);
  }
};

module.exports = {
  callHook,
};
