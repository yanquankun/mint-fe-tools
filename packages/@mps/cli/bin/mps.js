#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const version = require('../package.json').version;
const execa = require('execa');

program.name('mpscli').description('小程序ci构建工具脚手架').version(version);

program
  .command('init')
  .description('初始化mps项目目录，将在你的根目录中进行创建')
  .option('-e, --env <envName>', '设置你的项目环境')
  .option('-d, --debug', '是否开启初始化mps目录debug模式')
  .action(async (name) => {
    if (name.debug) {
      console.log('打开debug模式');
    }
    const env = name.env || '';
    if (env) {
      console.log(chalk.bgGreen.bgCyan(`当前设置环境是${env}`));
    }
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Generate project in current directory?`,
      },
    ]);
    if (!ok) {
      process.exit(1);
    }
    console.log(chalk.bgGreen.bgCyan('创建项目开始'));
  });

program
  .command('clean')
  .option('-d, --debug', '是否开启清除mps配置目录debug模式')
  .description('清除mps配置目录')
  .action(() => console.log(chalk.bgGreen.bgCyan('清除mps配置目录')));

program
  .command('git')
  .option('-u, --user', '获取git用户信息')
  .option('-b, --branch', '获取git分支名')
  .option('-r, --remote', '获取git远程仓库地址')
  .description('获取git信息')
  .action(async (name) => {
    if (name.user) {
      const { stdout } = await execa('git', ['config', 'user.name'], {
        // 运行命令时使用的当前工作目录
        cwd: process.cwd(),
      });
      console.log(chalk.bgGreen.bgCyan('git user:'), stdout);
    }
    if (name.branch) {
      const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'], {
        cwd: process.cwd(),
      });
      console.log(chalk.bgGreen.bgCyan('git branch:'), stdout);
    }
    if (name.remote) {
      const { stdout } = await execa('git', ['config', 'remote.origin.url'], {
        cwd: process.cwd(),
      });
      console.log(chalk.bgGreen.bgCyan('git remote:'), stdout);
    }
  });

program
  .command('build')
  .option('-d, --debug', '是否开启构建小程序debug模式')
  .description('构建小程序')
  .action((name) => {
    console.log(name);
    console.log(chalk.bgGreen.bgCyan('构建小程序'));
  });

program.on('command:*', ([cmd]) => {
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
});

program.on('--help', () => {
  console.log();
  console.log(`  运行 ${chalk.cyan(`mpscli <command> --help`)} 获取指令帮助`);
  console.log();
});

program.parse();
