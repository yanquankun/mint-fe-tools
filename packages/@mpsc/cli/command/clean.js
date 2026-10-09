const fs = require('fs-extra');
const path = require('path');
const { clack, ask, CancelledError } = require('../utils/terminal');

module.exports = async (generator, { isCleanSelf = false }) => {
  const target = path.join(process.cwd(), '.mps', ...(isCleanSelf ? [] : ['previewQrCode']));
  clack.intro('清理小程序配置');
  if (!(await fs.pathExists(target))) {
    clack.log.warn(`目录不存在：${target}`);
    return;
  }
  if (isCleanSelf) {
    const ok = await ask('confirm', {
      message: '确定删除整个 .mps 配置目录吗？',
      initialValue: false,
    });
    if (!ok) throw new CancelledError();
    await fs.remove(target);
  } else {
    // 保留二维码目录，仅清理其中的文件。
    await fs.emptyDir(target);
  }
  clack.outro(isCleanSelf ? '已删除 .mps 配置目录' : '已清空二维码目录');
};
