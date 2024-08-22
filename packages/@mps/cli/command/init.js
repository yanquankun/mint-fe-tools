const { isMpProject, getProjectPackageManage } = require('../tools/getProjectJson');
const _log = require('../utils/logger');
const cwd = process.cwd();
const { writeFileTree, isExitDir, root } = require('../utils/file');
const inquirer = require('inquirer');
const { loadModule } = require('../lib/module');

const render = async (generator, ejsOptions, isDebug) => {
  const templateFiles = await generator.render('/template', ejsOptions, isDebug);
  writeFileTree(cwd, templateFiles);
};

module.exports = async (generator, { isDebug = false, force = false, lbg = false }) => {
  const isMp = isMpProject(force, isDebug);
  if (!force && !isMp) {
    _log.error(
      '当前目录' + _log.chalk.yellow(cwd) + '不是小程序根项目，请在小程序根目录中执行mps init',
      'Init',
    );
    process.exit(1);
  }

  if (lbg) {
    const res = await loadModule('@mps/cli-lbg', root);
    console.log(res);
  }

  const packageManage = getProjectPackageManage();

  if (isExitDir('.mps', isDebug)) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: _log.chalk.red(
          `已存在.mps目录，是否仍要继续？继续执行将覆盖.mps目录下所有同名文件`,
        ),
      },
    ]);
    if (!ok) {
      process.exit(1);
    }
  }

  render(
    generator,
    {
      packageManage,
      lbg,
    },
    isDebug,
  );
};
