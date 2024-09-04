const _log = require('../utils/logger');
const ci = require('miniprogram-ci');
const path = require('path');
const { getMpsAppJson } = require('./getProjectJson');
const { isArray } = require('../utils/type');
const { timestampToTime } = require('../utils/common');
const execa = require('execa');
const { getCommit, getUser, getBranch, getRemote } = require('./git');
const isDebug = globalThis['buildDebug'] || false;
const { callHook } = require('./hook');
const { getFilesMapWithExtension } = require('../utils/file');
const { logWithSpinner, successSpinner } = require('../utils/spinner');

function getProject(appConfig) {
  return new ci.Project({
    appid: appConfig.appId,
    type: 'miniProgram',
    projectPath: appConfig.projectPath,
    privateKeyPath: appConfig.privateKeyPath,
    ignores: ['node_modules/**/*', '.mps/**/*'],
  });
}

const uploadMp = async (prompt, mpConfig, buildSuccessAppNames) => {
  const project = getProject(mpConfig);
  isDebug && _log.info(JSON.stringify(project), 'getProject');
  logWithSpinner(_log.chalk.green('⚓'), `${mpConfig.appName} 小程序构建中...`);

  try {
    const uploadResult = await ci.upload({
      project,
      version: prompt.version,
      desc: prompt.desc,
      setting: {
        es6: true,
        es7: true,
      },
      onProgressUpdate: (e) => _log.emitLog('info', 'ci.upload', JSON.stringify(e)),
      // robot: prompt.isProd ? 1 : 2,
    });

    buildSuccessAppNames.push(mpConfig.appName);

    isDebug && _log.info(JSON.stringify(uploadResult), 'uploadResult');

    _log.info(`${mpConfig.appName} 上传成功，请自行到微信后台设置体验版`, 'uploadMp');
  } catch (error) {
    _log.error(`${mpConfig.appName} 上传微信后台失败，原因：${error}`, 'uploadMp');
    process.exit(1);
  } finally {
    successSpinner();
  }
};

const buildPreview = async (prompt, mpConfig) => {
  const project = getProject(mpConfig);
  isDebug && _log.info(JSON.stringify(project), 'getProject');
  logWithSpinner(_log.chalk.green('⚓'), `${mpConfig.appName} 小程序构建中...`);

  try {
    const qrcodeName = `${mpConfig.appName}-有效期至${timestampToTime(
      +new Date() + 25 * 60 * 1000,
    )}`;
    const qrcodeOutputDest = path.join(process.cwd(), `.mps/previewQrCode/${qrcodeName}.jpg`);
    const previewResult = await ci.preview({
      project,
      desc: prompt.desc,
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
      onProgressUpdate: (e) => _log.emitLog('info', 'ci.preview', JSON.stringify(e)),
    });

    isDebug && _log.info(JSON.stringify(previewResult), 'buildPreview');

    _log.info(`${mpConfig.appName} 设置预览成功`, 'uploadMp');
  } catch (error) {
    _log.error(`${mpConfig.appName} 生成预览版失败，原因：${error}`, 'buildPreview');
    process.exit(1);
  } finally {
    successSpinner();
  }
};

module.exports = async (answer) => {
  const isLog = globalThis['buildLog'] || false;
  if (isLog) {
    const capturedFileName = timestampToTime(+new Date()) + '_mps.log';
    await execa('touch', [capturedFileName]);
    _log.writeLog(capturedFileName);
  }

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
  // !mpsJson.projectPath 代表为微信小程序原生，构建是通过开发者工具完成的
  if (mpsJson.projectPath) {
    const args = manager === 'yarn' ? [command] : ['run', command];
    logWithSpinner(
      '⚓',
      `小程序执行${manager} ${manager === 'yarn' ? command : 'run ' + command} 中...`,
    );
    execa.sync(manager, args, {
      cwd: process.cwd(),
    });
    successSpinner('执行完成');
  }

  // 本地版 先清空qrcode目录
  if (!answer.isProd) {
    execa('mpsc', ['clean'], {
      cwd: process.cwd(),
    });
  }

  await callHook('beforeBuild');

  const buildSuccessAppNames = [];
  for (let index = 0; index < weapps.length; index++) {
    const weapp = weapps[index];
    const appId = weapp.appId;
    const appName = weapp.appName;
    // 预览路径
    const prePagePath = weapp.prePagePath || '';
    // 密钥路径
    const privateKeyPath = path.join(process.cwd(), '.mps/secrets/private.' + appId + '.key');

    await callHook('beforeTaskBuild');

    const mpInfo = {
      appId,
      appName,
      prePagePath,
      projectPath,
      privateKeyPath,
    };
    if (answer.isProd) {
      await uploadMp(answer, mpInfo, buildSuccessAppNames);
    } else {
      await buildPreview(answer, mpInfo);
    }

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
    const extraInfo = {
      user: await getUser(),
      branch: await getBranch(),
      reomte: await getRemote(),
      tag: answer.isCreateTag ? await getCommit() : '',
      // prod 提供构建成功小程序的名称
      // dev 版本不需要，直接从qrcode filename 获取
      buildSuccessAppNames: answer.isProd ? buildSuccessAppNames.join(',') : '',
    };
    const options = {
      isProd: answer.isProd,
      extraInfo,
    };
    if (answer.isProd) {
      options.qrcodeFiles = [
        {
          baseUrl:
            'https://www.yanquankun.com:9300/cdn/mpsc/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8A%A9%E6%89%8B.jpeg',
          fileName: '微信扫码右侧小程序助手二维码访问最新体验版，如需设置体验版请联系上述开发人员',
        },
      ];
    } else {
      const qrcodePath = path.join(process.cwd(), '.mps/previewQrCode/');
      const qrcodeFiles = await getFilesMapWithExtension(qrcodePath, '.jpg');
      options.qrcodeFiles = qrcodeFiles;
    }

    await callHook('noticeTask', options);
  }

  _log.done('小程序构建完成', 'build');
  console.log('');
  answer.isAtuoUpdateQrcode &&
    _log.warn('已开启自动更新本地版二维码任务，请勿关闭当前命令窗口', 'Warn!!!');
  !answer.isAtuoUpdateQrcode && process.exit(1);
};
