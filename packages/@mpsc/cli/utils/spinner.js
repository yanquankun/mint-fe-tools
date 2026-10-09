const { clack } = require('./terminal');
const { emitLog } = require('./logger');
let active;
let lastMsg;

exports.logWithSpinner = (symbol, msg) => {
  exports.stopSpinner();
  lastMsg = msg || symbol;
  emitLog('info', 'progress', lastMsg);
  if (process.stdout.isTTY && !process.env.CI) {
    active = clack.spinner();
    active.start(lastMsg);
  } else {
    clack.log.step(lastMsg);
  }
};

exports.stopSpinner = () => {
  if (active) active.stop(lastMsg);
  active = undefined;
};
exports.pauseSpinner = exports.stopSpinner;
exports.resumeSpinner = () => {
  if (lastMsg) exports.logWithSpinner(lastMsg);
};
exports.failSpinner = (text = '执行失败') => {
  if (active) active.stop(text, 1);
  else clack.log.error(text);
  active = undefined;
  lastMsg = undefined;
};
exports.successSpinner = (text = '执行完成') => {
  if (active) active.stop(text);
  else clack.log.success(text);
  active = undefined;
  lastMsg = undefined;
  emitLog('success', 'successSpinner', text);
};
