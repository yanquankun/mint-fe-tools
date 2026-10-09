const { isMpProject, getProjectPackageManage } = require('../tools/getProjectJson');
const _log = require('../utils/logger');
const cwd = process.cwd();
const { writeFileTree, isExitDir, root } = require('../utils/file');
const { clack, ask, CancelledError } = require('../utils/terminal');
const { loadModule } = require('../lib/module');
const { isFunction } = require('../utils/type');
const cliLbgPath = `${root}/node_modules/@mpsc/cli-lbg`;
const isDebug = globalThis['initDebug'] || false;

const render = async (generator, ejsOptions) => {
  const templateFiles = await generator.render('/template', ejsOptions, isDebug);
  await writeFileTree(cwd, templateFiles);

  _log.done('.mps目录创建成功', 'writeFileTree');
};

module.exports = async (generator, { force = false, lbg = false }) => {
  clack.intro('初始化小程序配置');
  const isMp = isMpProject(force, isDebug);
  if (!force && !isMp) {
    _log.error(
      '当前目录' + _log.chalk.yellow(cwd) + '不是小程序根项目，请在小程序根目录中执行mps init',
      'Init',
    );
    process.exit(1);
  }

  if (isExitDir('.mps', isDebug)) {
    const ok = await ask('confirm', {
      message: '已存在 .mps 目录，是否覆盖同名文件？',
      initialValue: false,
    });
    if (!ok) throw new CancelledError();
  }

  // 获取lbg 通知模板
  let lbgNoticeTaskTemp = '';
  if (lbg) {
    try {
      const { lbg: lbgModule } = await loadModule('@mpsc/cli-lbg', root);
      isFunction(lbgModule.getLbgNoticeTaskTemp) &&
        (lbgNoticeTaskTemp = lbgModule.getLbgNoticeTaskTemp(cliLbgPath));
    } catch (err) {
      if (isDebug) {
        console.log('');
        _log.error(err, 'init');
        console.log('');
        _log.error('.mps目录创建失败', 'getLbgNoticeTaskTemp');
      }
      throw err;
    }
  }

  // 获取包管理工具
  const packageManage = getProjectPackageManage();

  await render(
    generator,
    {
      packageManage,
      lbgNoticeTaskTemp,
    },
    isDebug,
  );
  clack.outro('初始化完成');
};
