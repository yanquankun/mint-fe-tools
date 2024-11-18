#!/usr/bin/env node
const program = require('commander');
const version = require('../package.json').version;
const generator = require('../lib/generator');
const { loadLocalModule } = require('../lib/module');
const _log = require('../utils/logger');
const { isFunction } = require('../utils/type');
const git = require('../tools/git');
const path = require('path');
const execa = require('execa');
const minimist = require('minimist');

program.name('mpscli').description('小程序ci构建工具脚手架').version(version);

program
  .command('init')
  .description('初始化mps项目目录，将在你的根目录中进行创建，请在你的小程序项目根目录中安装')
  // .option('-e, --env <envName>', '设置你的项目环境')
  .option('-d, --debug', '开启初始化mps目录debug模式')
  .option(
    '-f, --force <path>',
    '强制在当前目录初始化cli结构，强制会直接在当前目录安装。有可能你的项目是monorepo结构，虽然你可以给每个子包都安装mpscli，但建议只维护一个mpscli配置目录',
  )
  .option('-l, --lbg', '使用lbg插件')
  .action(async (name) => {
    // const env = name.env || '';
    // if (env) {
    //   _log.info(`当前设置环境是${env}`, 'init');
    // }
    _log.info('创建项目开始', 'init');
    if (name.debug) {
      globalThis['initDebug'] = true;
    }
    try {
      const fn = await loadLocalModule('../command/init.js');
      isFunction(fn) &&
        fn.call(null, generator, {
          path: name.path,
          force: name.force,
          lbg: name.lbg,
        });
    } catch (e) {
      _log.error(e, 'init');
    }
  });

program
  .command('clean')
  .option('-d, --debug', '开启清除mps配置目录debug模式')
  .option('-q, --qrcode', '清除本地版二维码目录内容')
  .option('-s, --self', '清除整个mps构建目录')
  .description('清除mps配置目录')
  .action(async (name) => {
    _log.info('开始执行清除操作', 'clean');
    try {
      if (name.debug) {
        globalThis['cleanDebug'] = true;
      }
      const fn = await loadLocalModule('../command/clean.js');
      isFunction(fn) && fn.call(null, generator, { isCleanSelf: Boolean(name.self) });
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
      const stdout = await git.getUser();
      _log.info(`${stdout}`, 'git user:');
    }
    if (name.branch) {
      const stdout = await git.getBranch();
      _log.info(`${stdout}`, 'git branch:');
    }
    if (name.remote) {
      const stdout = await git.getRemote();
      _log.info(`${stdout}`, 'git remote:');
    }
    if (name.commit) {
      const stdout = await git.getCommit();
      _log.info(`${stdout}`);
    }
  });

program
  .command('build')
  .option('-d, --debug', '开启构建小程序debug模式')
  .option('-l, --log', '开启日志记录模式')
  .description('构建小程序')
  .action(async (name) => {
    if (name.debug) {
      globalThis['buildDebug'] = true;
    }

    if (name.log) {
      globalThis['buildLog'] = true;
    }

    _log.info('开始构建小程序', 'build');
    try {
      const fn = await loadLocalModule('../command/build.js');
      isFunction(fn) &&
        fn.call(null, {
          log: name.log,
        });
    } catch (e) {
      _log.error(e, 'build');
    }
  });

program
  .command('server')
  .description('启动脚手架可视化页面')
  .action(async () => {
    _log.info('开始启动脚手架可视化页面', 'server');
    const args = minimist(process.argv.slice(2), { '--': true });

    try {
      process.env.version = version;
      process.env.projectName = path.basename(process.cwd());

      const cmdPath = path.resolve(__dirname, '../');
      if (args['--'] && args['--'].includes('nodemon')) {
        await execa(
          'npx',
          [
            'nodemon',
            '--config',
            `${cmdPath}/nodemon.json`,
            '--watch',
            `${cmdPath}/lib/server.js`,
            '--watch',
            `${cmdPath}/lib/http.js`,
            '--exec',
            'node',
            `${cmdPath}/lib/server.js`,
          ],
          {
            stdio: 'inherit',
            env: {
              ...process.env,
            },
          },
        );
      } else {
        await execa('node', [`${cmdPath}/lib/server.js`], {
          stdio: 'inherit',
          env: {
            ...process.env,
          },
        });
      }
    } catch (e) {
      _log.error(e, 'server');
    }
  });

program.on('command:*', ([cmd]) => {
  _log.error(`Unknown command ${_log.chalk.yellow(cmd)}.`);
});

program.on('--help', () => {
  console.log();
  _log.info(` 运行 ${_log.chalk.cyan(`mpscli <command> --help`)} 获取指令帮助`);
  _log.info(` ${_log.chalk.red(`所有指令请在与.mps同级目录进行操作`)} `);
  console.log();
});

program.parse();
