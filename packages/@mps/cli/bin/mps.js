#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
// const inquirer = require('inquirer');
const version = require('../package.json').version;
const execa = require('execa');
const generator = require('../lib/generator');
const { loadLocalModule } = require('../lib/module');
const _log = require('../utils/logger');
const { isFunction } = require('../utils/type');

program.name('mpscli').description('小程序ci构建工具脚手架').version(version);

program
  .command('init')
  .description('初始化mps项目目录，将在你的根目录中进行创建，请在你的项目根目录中安装')
  // .option('-e, --env <envName>', '设置你的项目环境')
  .option('-d, --debug', '是否开启初始化mps目录debug模式')
  .option(
    '-f, --force <path>',
    '是否强制在当前目录初始化cli结构，强制会直接在当前目录安装。有可能你的项目是monorepo结构，虽然你可以给每个子包都安装mpscli，但建议只维护一个mpscli配置目录',
  )
  .action(async (name) => {
    // const env = name.env || '';
    // if (env) {
    //   _log.info(`当前设置环境是${env}`, 'init');
    // }
    // const { ok } = await inquirer.prompt([
    //   {
    //     name: 'ok',
    //     type: 'confirm',
    //     message: `Generate project in current directory?`,
    //   },
    // ]);
    // if (!ok) {
    //   process.exit(1);
    // }
    _log.info('创建项目开始', 'init');
    try {
      const fn = await loadLocalModule('../command/init.js');
      isFunction(fn) &&
        fn.call(null, generator, {
          path: name.path,
          force: name.force,
        });
    } catch (e) {
      _log.error(e, 'init');
    }
  });

program
  .command('clean')
  .option('-d, --debug', '是否开启清除mps配置目录debug模式')
  .option('-q, --qrcode', '清除本地版二维码目录内容')
  .option('-s, --self', '清除整个mps构建目录')
  .description('清除mps配置目录')
  .action(async (name) => {
    _log.info('开始执行清除操作', 'clean');
    try {
      const fn = await loadLocalModule('../command/clean.js');
      isFunction(fn) &&
        fn.call(null, generator, { isCleanSelf: Boolean(name.self), isDebug: Boolean(name.debug) });
    } catch (e) {
      _log.error(e, 'clean');
    }
  });

program
  .command('git')
  .option('-u, --user', '获取git用户信息')
  .option('-b, --branch', '获取git分支名')
  .option('-r, --remote', '获取git远程仓库地址')
  .option('-c, --commit', '获取git最新提交记录')
  .description('获取git信息')
  .action(async (name) => {
    if (name.user) {
      const { stdout } = await execa('git', ['config', 'user.name'], {
        // 运行命令时使用的当前工作目录
        cwd: process.cwd(),
      });
      _log.info(`${stdout}`, 'git user:');
    }
    if (name.branch) {
      const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'], {
        cwd: process.cwd(),
      });
      _log.info(`${stdout}`, 'git branch:');
    }
    if (name.remote) {
      const { stdout } = await execa('git', ['config', 'remote.origin.url'], {
        cwd: process.cwd(),
      });
      _log.info(`${stdout}`, 'git remote:');
    }
    if (name.commit) {
      const { stdout: author } = await execa('git', ['log', '-1', '--pretty=format:%cn'], {
        cwd: process.cwd(),
      });
      const { stdout: date } = await execa(
        'git',
        ['log', '-1', '--pretty=format:%ad', '--date=format:%Y-%m-%d_%H:%M:%S'],
        {
          cwd: process.cwd(),
        },
      );
      const { stdout: commit } = await execa('git', ['log', '-1', '--pretty=format:%s'], {
        cwd: process.cwd(),
      });
      _log.info(`${author}-${date}-${commit.trim()}`.replace(/\s/g, ''), 'git commit:');
    }
  });

program
  .command('build')
  .option('-d, --debug', '是否开启构建小程序debug模式')
  .description('构建小程序')
  .action(async (name) => {
    if (name.debug) {
      _log.log('打开debug模式', 'build');
    }

    _log.info('开始构建小程序', 'build');
    try {
      const fn = await loadLocalModule('../command/build.js');
      isFunction(fn) && fn.call(null, generator, Boolean(name.debug));
    } catch (e) {
      _log.error(e, 'build');
    }
  });

program.on('command:*', ([cmd]) => {
  _log.error(`Unknown command ${chalk.yellow(cmd)}.`);
});

program.on('--help', () => {
  console.log();
  _log.info(` 运行 ${chalk.cyan(`mpscli <command> --help`)} 获取指令帮助`);
  _log.info(` ${chalk.red(`所有指令请在与.mps同级目录进行操作`)} `);
  console.log();
});

program.parse();
