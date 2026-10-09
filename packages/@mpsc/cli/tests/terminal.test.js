const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

function load(file, mocks, globals = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const realRequire = createRequire(filename);
  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    process,
    console,
    setTimeout,
    ...globals,
    require: (name) => (name in mocks ? mocks[name] : realRequire(name)),
  };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return module.exports;
}
const fakeClack = { intro() {}, outro() {}, log: { warn() {} } };

test('非交互环境在调用提示前报错，不能默认执行发布', async () => {
  let prompted = false;
  const { ask } = load(
    'utils/terminal.js',
    {
      '@clack/prompts': {
        text: () => {
          prompted = true;
        },
      },
    },
    { process: { stdin: {}, stdout: {}, env: {} } },
  );
  await assert.rejects(ask('text', {}), /交互式终端/);
  assert.equal(prompted, false);
});
test('取消问答返回可识别的 130 状态', async () => {
  const cancelled = Symbol('cancel');
  const { ask } = load(
    'utils/terminal.js',
    {
      '@clack/prompts': { text: async () => cancelled, isCancel: (v) => v === cancelled },
    },
    { process: { stdin: { isTTY: true }, stdout: { isTTY: true }, env: {} } },
  );
  await assert.rejects(ask('text', {}), (error) => error.exitCode === 130);
});
function buildFlow({ answers, branch = 'master', build = async () => {}, askOverride }) {
  const questions = [];
  const fn = load('tools/buildPrompt.js', {
    '../utils/terminal': {
      clack: fakeClack,
      ask: async (type, options) => {
        questions.push({ type, options });
        if (askOverride) return askOverride(type, options);
        return answers.shift();
      },
    },
    '../utils/logger': { error() {} },
    './getProjectJson': {
      getProjectPackage: () => ({ version: '1.2.3' }),
      getMpsAppJson: () => ({ branchs: ['master'] }),
    },
    './git': { getBranch: async () => branch },
    './buildMp': build,
  });
  return { fn, questions };
}
test('发布问答保持布尔值及字段，并等待构建完成', async () => {
  let result;
  const { fn, questions } = buildFlow({
    answers: ['说明', '1.2.3', false, true, false],
    build: async (answer) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      result = answer;
    },
  });
  await fn();
  assert.equal(result.desc, '说明');
  assert.equal(result.isProd, true);
  assert.equal(result.groupNotice, false);
  assert.equal(result.isCreateTag, false);
  const version = questions[1].options;
  assert.equal(version.defaultValue, '1.2.3');
  assert.equal(version.validate(''), undefined);
  assert.equal(version.validate('1.2.3'), undefined);
  assert.equal(typeof version.validate('not-a-version'), 'string');
});
test('预览路径不询问 tag，并传入自动更新字段', async () => {
  let result;
  const { fn, questions } = buildFlow({
    answers: ['预览', '1', false, false, false],
    build: async (value) => {
      result = value;
    },
  });
  await fn();
  assert.equal(result.isProd, false);
  assert.equal(result.isAtuoUpdateQrcode, false);
  assert.match(questions.at(-1).options.message, /二维码/);
});
test('取消任意问题后不会启动构建', async () => {
  let built = false;
  const { fn } = buildFlow({
    askOverride: () => {
      throw new Error('取消');
    },
    build: async () => {
      built = true;
    },
  });
  await assert.rejects(fn(), /取消/);
  assert.equal(built, false);
});
test('非白名单分支禁止发布', async () => {
  let built = false;
  const { fn } = buildFlow({
    answers: ['发布', '1', false, true],
    branch: 'feature/test',
    build: async () => {
      built = true;
    },
  });
  await assert.rejects(fn(), /白名单/);
  assert.equal(built, false);
});
test('异步构建失败向上传递', async () => {
  const { fn } = buildFlow({
    answers: ['发布', '1', false, true, false],
    build: async () => {
      throw new Error('上传失败');
    },
  });
  await assert.rejects(fn(), /上传失败/);
});
test('拒绝清理配置时不删除文件', async () => {
  let removed = false;
  const clean = load('command/clean.js', {
    'fs-extra': {
      pathExists: async () => true,
      remove: async () => {
        removed = true;
      },
    },
    '../utils/terminal': { clack: fakeClack, ask: async () => false, CancelledError: Error },
  });
  await assert.rejects(clean(null, { isCleanSelf: true }));
  assert.equal(removed, false);
});

function uploadFlow({ fail = false, isFromServer = false } = {}) {
  const events = [];
  const log = { info() {}, error() {}, done() {}, warn() {}, emitLog() {} };
  log.chalk = { green: (value) => value, yellow: (value) => value };
  const build = load(
    'tools/buildMp.js',
    {
      '../utils/logger': log,
      'miniprogram-ci': {
        Project: class {},
        upload: async () => {
          if (fail) throw new Error('上传失败');
        },
      },
      './getProjectJson': {
        getMpsAppJson: () => ({ weapps: [{ appId: 'test', appName: '测试' }] }),
      },
      './git': {},
      './hook': { callHook: async () => {} },
      '../utils/file': {},
      '../utils/spinner': {
        logWithSpinner: () => events.push('start'),
        successSpinner: () => events.push('success'),
        failSpinner: () => events.push('failure'),
      },
    },
    {
      process: {
        cwd: () => '/tmp',
        exit: () => {
          throw new Error('不应强制退出');
        },
      },
    },
  );
  return { run: () => build({ isProd: true }, isFromServer), events };
}
test('上传成功返回而不以失败状态退出', async () => {
  const { run, events } = uploadFlow();
  await run();
  assert.deepEqual(events, ['start', 'success']);
});
test('上传失败只显示失败状态并向上传递', async () => {
  const { run, events } = uploadFlow({ fail: true });
  await assert.rejects(run(), /上传失败/);
  assert.deepEqual(events, ['start', 'failure']);
});
