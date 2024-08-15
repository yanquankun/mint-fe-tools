#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const version = require('../package.json').version;

program
  .name('mpscli')
  .description('小程序ci构建工具脚手架')
  .option('-d, --debug', '是否开启debug模式')
  .version(version);

program
  .command('init')
  .description('初始化mps项目目录，将在你的根目录中进行创建')
  .option('-e, --env <envName>', '设置你的项目环境')
  .action(async (name) => {
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
  .description('清除mps配置目录')
  .action(() => console.log(chalk.bgGreen.bgCyan('清除mps配置目录')));

program.on('command:*', ([cmd]) => {
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
});

program.on('--help', () => {
  console.log();
  console.log(`  运行 ${chalk.cyan(`mpscli <command> --help`)} 获取指令帮助`);
  console.log();
});

program.parse();
