const _log = require('../utils/logger');
const ci = require('miniprogram-ci');
const path = require('path');
const { getMpsAppJson } = require('./getProjectJson');
const { isArray } = require('../utils/type');
const { timestampToTime } = require('../utils/common');
const execa = require('execa');
const { getCommit } = require('./git');
const isDebug = globalThis['buildDebug'] || false;
const { callHook } = require('./hook');
const { getFilesMapWithExtension } = require('../utils/file');

function getProject(appConfig) {
  return new ci.Project({
    appid: appConfig.appId,
    type: 'miniProgram',
    projectPath: appConfig.projectPath,
    privateKeyPath: appConfig.privateKeyPath,
    ignores: ['node_modules/**/*', '.mps/**/*'],
  });
}

const uploadMp = async (prompt, mpConfig) => {
  const project = getProject(mpConfig);
  isDebug && _log.info(JSON.stringify(project), 'getProject');

  try {
    const uploadResult = await ci.upload({
      project,
      version: prompt.version,
      desc: prompt.desc,
      setting: {
        es6: true,
        es7: true,
      },
    });

    isDebug && _log.info(JSON.stringify(uploadResult), 'uploadResult');

    _log.info(`${mpConfig.appName} 上传成功，请自行到微信后台设置体验版`, 'uploadMp');
  } catch (error) {
    _log.error(`${mpConfig.appName} 上传微信后台失败，原因：${error}`, 'uploadMp');
    process.exit(1);
  }

  if (prompt.isCreateQrcode) await buildPreview(project, prompt, mpConfig);
};

const buildPreview = async (project, prompt, mpConfig) => {
  try {
    const qrcodeName = `${mpConfig.appName}-有效期至${timestampToTime(
      +new Date() + 25 * 60 * 1000,
    )}`;
    const qrcodeOutputDest = path.join(process.cwd(), `.mps/previewQrCode/${qrcodeName}.jpg`);
    const previewResult = await ci.preview({
      project,
      desc: prompt.desc, // 此备注将显示在“小程序助手”开发版列表中
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minify: true,
        autoPrefixWXSS: true,
      },
      pagePath: mpConfig.prePagePath,
      qrcodeFormat: 'image',
      qrcodeOutputDest,
    });

    isDebug && _log.info(JSON.stringify(previewResult), 'buildPreview');

    _log.info(`${mpConfig.appName} 设置预览成功`, 'uploadMp');
  } catch (error) {
    _log.error(
      `${mpConfig.appName} 生成预览版失败，但构建包仍然上传到微信后台，可自行到微信后台设置体验版，原因：${error}`,
      'buildPreview',
    );
    process.exit(1);
  }
};

module.exports = async (answer) => {
  _log.info('即将开始构建小程序', 'buildMp');
  const mpsJson = getMpsAppJson();
  // 项目路径，即 project.config.json 所在的目录
  const projectPath = path.join(process.cwd(), mpsJson.projectPath || '');

  const weapps = mpsJson.weapps;
  if (!isArray(weapps) || !weapps.length) {
    _log.error(
      `没有发现任何小程序配置，请检查 ${_log.chalk.yellow(
        '.mps/apps.json',
      )} 文件中 ${_log.chalk.yellow('weapps')} 字段是否配置正确`,
      'buildMp',
    );
  }

  // 执行build构建
  const manager = mpsJson.manager;
  const command = mpsJson.command;
  // !projectPath 代表为微信小程序原生，构建是通过开发者工具完成的
  if (!projectPath) {
    const args = manager === 'yarn' ? [command] : ['run', command];
    execa.sync(manager, args, {
      cwd: process.cwd(),
    });
  }

  if (answer.isCreateQrcode) {
    execa('mpsc', ['clean'], {
      cwd: process.cwd(),
    });
  }

  await callHook('beforeBuild');

  for (let index = 0; index < weapps.length; index++) {
    const weapp = weapps[index];
    const appId = weapp.appId;
    const appName = weapp.appName;
    // 预览路径
    const prePagePath = weapp.prePagePath || '';
    // 密钥路径
    const privateKeyPath = path.join(process.cwd(), '.mps/secrets/private.' + appId + '.key');

    await callHook('beforeTaskBuild');
    await uploadMp(answer, {
      appId,
      appName,
      prePagePath,
      projectPath,
      privateKeyPath,
    });
    await callHook('afterTaskBuild');
  }

  await callHook('afterBuild');

  // 生成tag
  if (answer.isCreateTag) {
    const tagName = await getCommit();

    try {
      execa.sync('git', ['tag', tagName], {
        cwd: process.cwd(),
      });
    } catch (error) {
      _log.error('生成tag失败：' + error, 'TagName');
    }
    try {
      execa.sync('git', ['push', 'origin', tagName], {
        cwd: process.cwd(),
      });
    } catch (error) {
      _log.error('推送tag失败：' + error, 'TagName');
    }

    _log.info(`TAG： ${tagName} 推送成功`, 'TagName');
  }

  // 群通知
  if (answer.groupNotice) {
    _log.done('群通知任务执行中...', 'build');
    const qrcodePath = path.join(process.cwd(), '.mps/previewQrCode/');
    const qrcodeFiles = await getFilesMapWithExtension(qrcodePath, '.jpg');
    await callHook('noticeTask', qrcodeFiles);
  }

  _log.done('小程序构建完成', 'build');
  console.log('');
  answer.isAtuoUpdateQrcode &&
    _log.warn('已开启自动更新本地版二维码任务，请勿关闭当前命令窗口', 'Warn!!!');
  !answer.isAtuoUpdateQrcode && process.exit(1);
};
