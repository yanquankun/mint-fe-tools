const clack = require('@clack/prompts');

class CancelledError extends Error {
  constructor() {
    super('操作已取消');
    this.exitCode = 130;
  }
}

async function ask(type, options) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || process.env.CI) {
    throw new Error('当前命令需要交互式终端，请在终端中运行；自动化构建请使用已有的服务端构建接口');
  }
  const value = await clack[type](options);
  if (clack.isCancel(value)) {
    throw new CancelledError();
  }
  return value;
}

module.exports = { clack, ask, CancelledError };
