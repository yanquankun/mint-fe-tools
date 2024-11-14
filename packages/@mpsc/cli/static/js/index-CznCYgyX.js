import {
  d as e,
  r as a,
  D as t,
  o as l,
  b as o,
  e as r,
  Q as s,
  ai as n,
  y as i,
  Z as c,
  K as d,
  I as u,
  V as p,
  U as m,
  P as g,
  _ as f,
  Y as v,
  a4 as _,
  u as h,
  ab as y,
} from '../vender/third_party-CFSxMbpH.js';
import {
  E as b,
  a as k,
  b as x,
  c as V,
  d as N,
  e as P,
  v as U,
  f as w,
  g as O,
  h as R,
  i as I,
  j as E,
  k as A,
  l as C,
} from '../vender/element-plus-CHKDGd9E.js';
!(function () {
  const e = document.createElement('link').relList;
  if (!(e && e.supports && e.supports('modulepreload'))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) a(e);
    new MutationObserver((e) => {
      for (const t of e)
        if ('childList' === t.type)
          for (const e of t.addedNodes) 'LINK' === e.tagName && 'modulepreload' === e.rel && a(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function a(e) {
    if (e.ep) return;
    e.ep = !0;
    const a = (function (e) {
      const a = {};
      return (
        e.integrity && (a.integrity = e.integrity),
        e.referrerPolicy && (a.referrerPolicy = e.referrerPolicy),
        'use-credentials' === e.crossOrigin
          ? (a.credentials = 'include')
          : 'anonymous' === e.crossOrigin
          ? (a.credentials = 'omit')
          : (a.credentials = 'same-origin'),
        a
      );
    })(e);
    fetch(e.href, a);
  }
})();
var T = ((e) => (
  (e.DEBUG = 'debug'), (e.INFO = 'info'), (e.WARN = 'warn'), (e.ERROR = 'error'), e
))(T || {});
const L = { class: 'logger-ui' },
  j = { class: 'logger-output-time' },
  D = (e, a) => {
    const t = e.__vccOpts || e;
    for (const [l, o] of a) t[l] = o;
    return t;
  },
  F = D(
    e({
      __name: 'Log',
      setup(e, { expose: u }) {
        const p = a(null),
          m = a([]),
          g = {
            [T.INFO]: 'logger-output-info',
            [T.WARN]: 'logger-output-warn',
            [T.ERROR]: 'logger-output-error',
            [T.DEBUG]: 'logger-output-debug',
          };
        u({
          clear: () => {
            m.value = [
              {
                time: new Date().toLocaleTimeString(),
                level: T.INFO,
                message: '小程序构建日志监控',
              },
            ];
          },
          startWatch: () => {
            f({ level: T.INFO, message: '开始监听构建日志' });
          },
        });
        const f = (e) => {
            m.value.push({
              time: new Date().toLocaleTimeString(),
              level: e.level,
              message: e.message,
            }),
              v();
          },
          v = async () => {
            await i(), p.value && (p.value.scrollTop = p.value.scrollHeight);
          };
        return (
          t(() => {
            f({ level: T.INFO, message: '小程序构建日志监控' });
          }),
          (e, a) => (
            l(),
            o('div', L, [
              r(
                'div',
                { class: 'logger-output', ref_key: 'logOutput', ref: p },
                [
                  (l(!0),
                  o(
                    s,
                    null,
                    n(
                      m.value,
                      (e, a) => (
                        l(),
                        o('p', { key: a }, [
                          r('span', j, c(e.time), 1),
                          r('span', { class: d(g[e.level]) }, c(e.message), 3),
                        ])
                      ),
                    ),
                    128,
                  )),
                ],
                512,
              ),
            ])
          )
        );
      },
    }),
    [['__scopeId', 'data-v-16dbec37']],
  ),
  q = D(
    e({
      __name: 'Config',
      emits: ['clearPage', 'startBuild'],
      setup(e, { emit: t }) {
        const o = a(),
          r = u({
            desc: [{ required: !0, message: '请输入描述', trigger: 'blur' }],
            version: [
              {
                validator: (e, a, t) => {
                  a && !/^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/.test(a)
                    ? t(new Error('格式为[x.[y.[z]]]，不填则以package.json的version字段为准!'))
                    : t();
                },
                trigger: 'blur',
              },
            ],
          }),
          s = u({
            desc: '',
            version: '',
            groupNotice: !1,
            isProd: !1,
            isAutoUpdateQrcode: !1,
            isCreateTag: !1,
          }),
          n = t;
        return (e, a) => {
          const t = k,
            i = x,
            c = V,
            d = N,
            u = P;
          return (
            l(),
            p(
              u,
              {
                ref_key: 'configFormRef',
                ref: o,
                model: s,
                rules: r,
                'label-width': '200px',
                style: { 'max-width': '600px' },
                'status-icon': '',
                class: 'config-form',
              },
              {
                default: m(() => [
                  g(
                    i,
                    { prop: 'desc', label: '输入描述' },
                    {
                      default: m(() => [
                        g(
                          t,
                          {
                            maxlength: '100',
                            type: 'textarea',
                            resize: 'none',
                            rows: 4,
                            placeholder: '请输入描述',
                            modelValue: s.desc,
                            'onUpdate:modelValue': a[0] || (a[0] = (e) => (s.desc = e)),
                          },
                          null,
                          8,
                          ['modelValue'],
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  g(
                    i,
                    { prop: 'version', label: '输入版本' },
                    {
                      default: m(() => [
                        g(
                          t,
                          {
                            maxlength: '20',
                            placeholder: '请输入版本',
                            modelValue: s.version,
                            'onUpdate:modelValue': a[1] || (a[1] = (e) => (s.version = e)),
                          },
                          null,
                          8,
                          ['modelValue'],
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  g(
                    i,
                    { prop: 'groupNotice', label: '是否发送群通知' },
                    {
                      default: m(() => [
                        g(
                          c,
                          {
                            modelValue: s.groupNotice,
                            'onUpdate:modelValue': a[2] || (a[2] = (e) => (s.groupNotice = e)),
                            'inline-prompt': '',
                            'active-text': '是',
                            'inactive-text': '否',
                          },
                          null,
                          8,
                          ['modelValue'],
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  g(
                    i,
                    { prop: 'isProd', label: '是否为发布版本' },
                    {
                      default: m(() => [
                        g(
                          c,
                          {
                            modelValue: s.isProd,
                            'onUpdate:modelValue': a[3] || (a[3] = (e) => (s.isProd = e)),
                            'inline-prompt': '',
                            'active-text': '是',
                            'inactive-text': '否',
                          },
                          null,
                          8,
                          ['modelValue'],
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                  s.isProd
                    ? f('', !0)
                    : (l(),
                      p(
                        i,
                        { key: 0, prop: 'isAutoUpdateQrcode', label: '是否自动更新本地版二维码 ' },
                        {
                          default: m(() => [
                            g(
                              c,
                              {
                                modelValue: s.isAutoUpdateQrcode,
                                'onUpdate:modelValue':
                                  a[4] || (a[4] = (e) => (s.isAutoUpdateQrcode = e)),
                                'inline-prompt': '',
                                'active-text': '是',
                                'inactive-text': '否',
                              },
                              null,
                              8,
                              ['modelValue'],
                            ),
                          ]),
                          _: 1,
                        },
                      )),
                  s.isProd
                    ? (l(),
                      p(
                        i,
                        { key: 1, prop: 'isCreateTag', label: '是否打tag' },
                        {
                          default: m(() => [
                            g(
                              c,
                              {
                                modelValue: s.isCreateTag,
                                'onUpdate:modelValue': a[5] || (a[5] = (e) => (s.isCreateTag = e)),
                                'inline-prompt': '',
                                'active-text': '是',
                                'inactive-text': '否',
                              },
                              null,
                              8,
                              ['modelValue'],
                            ),
                          ]),
                          _: 1,
                        },
                      ))
                    : f('', !0),
                  g(i, null, {
                    default: m(() => [
                      g(
                        d,
                        {
                          class: 'config-form-clear',
                          onClick: a[6] || (a[6] = (e) => n('clearPage')),
                        },
                        { default: m(() => a[8] || (a[8] = [v('清空页面内容')])), _: 1 },
                      ),
                      g(
                        d,
                        {
                          class: 'config-form-submit',
                          type: 'primary',
                          onClick:
                            a[7] ||
                            (a[7] = (e) =>
                              (async (e) => {
                                e &&
                                  (await e.validate((e) => {
                                    e ? n('startBuild') : b.warning('请完善表单信息!');
                                  }));
                              })(o.value)),
                        },
                        { default: m(() => a[9] || (a[9] = [v('开始构建')])), _: 1 },
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
                _: 1,
              },
              8,
              ['model', 'rules'],
            )
          );
        };
      },
    }),
    [['__scopeId', 'data-v-df344bd6']],
  ),
  B = {
    'element-loading-text': '查询中...',
    'element-loading-background': 'rgba(122, 122, 122, 0.4)',
    class: 'container',
  },
  Q = { key: 1, class: 'container-qrcode' },
  S = D(
    e({
      __name: 'Result',
      setup(e) {
        const t = a(!1),
          r = a();
        return (e, a) => {
          var s;
          const n = w,
            i = U;
          return _(
            (l(),
            o('div', B, [
              (null == (s = r.value) ? void 0 : s.length)
                ? (l(), o('div', Q))
                : (l(), p(n, { key: 0, description: '暂无数据' })),
            ])),
            [[i, t.value]],
          );
        };
      },
    }),
    [['__scopeId', 'data-v-9d928d00']],
  ),
  W = { class: 'container' },
  G = { class: 'container-header-operations' },
  M = { key: 0 },
  z = { key: 1, class: 'container-result' },
  K = D(
    e({
      __name: 'App',
      setup(e) {
        const s = new URLSearchParams(location.search).get('id') || '',
          n = a(null),
          i = () => {
            n.value && n.value.startWatch();
          },
          c = () => {
            n.value && n.value.clear();
          };
        return (
          t(() => {
            fetch('/api/getMessage', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
              .then((e) => e.json())
              .then((e) => {
                console.log('服务器返回:', e);
              })
              .catch((e) => console.error('请求出错:', e));
          }),
          (e, a) => {
            const t = R,
              d = I,
              u = E,
              p = A,
              f = O;
            return (
              l(),
              o('div', W, [
                g(f, null, {
                  default: m(() => [
                    g(
                      d,
                      { height: '50px', class: 'container-header' },
                      {
                        default: m(() => [
                          a[2] ||
                            (a[2] = r(
                              'div',
                              { class: 'container-header-title' },
                              [
                                r('span', null, '小程序 ci 构建脚手架工具'),
                                r('span', { class: 'container-header-title-line' }, '|'),
                                r('span', { class: 'container-header-title-extra' }, '0.0.1'),
                                r('span', { class: 'container-header-title-line' }, '|'),
                                r('span', { class: 'container-header-title-extra' }, 'banma_mp'),
                              ],
                              -1,
                            )),
                          r('div', G, [
                            g(
                              t,
                              {
                                type: 'primary',
                                href: 'https://github.com/yanquankun/mint-fe-tools/blob/feature/v0.0.5/packages/%40mpsc/cli/README.md',
                                target: '_blank',
                              },
                              { default: m(() => a[0] || (a[0] = [v('使用手册')])), _: 1 },
                            ),
                            g(
                              t,
                              {
                                type: 'primary',
                                href: 'https://github.com/yanquankun/mint-fe-tools/issues',
                                target: '_blank',
                              },
                              { default: m(() => a[1] || (a[1] = [v('问题反馈')])), _: 1 },
                            ),
                          ]),
                        ]),
                        _: 1,
                      },
                    ),
                    h(s)
                      ? (l(), o('div', z, [g(S)]))
                      : (l(),
                        o('div', M, [
                          g(
                            u,
                            { 'content-position': 'left', 'border-style': 'dashed' },
                            { default: m(() => a[3] || (a[3] = [v('构建选项')])), _: 1 },
                          ),
                          g(
                            p,
                            { class: 'container-config' },
                            { default: m(() => [g(q, { onStartBuild: i, onClearPage: c })]), _: 1 },
                          ),
                          g(
                            u,
                            { 'content-position': 'left', 'border-style': 'dashed' },
                            { default: m(() => a[4] || (a[4] = [v('输出日志')])), _: 1 },
                          ),
                          g(
                            p,
                            { class: 'container-log' },
                            {
                              default: m(() => [g(F, { ref_key: 'logger', ref: n }, null, 512)]),
                              _: 1,
                            },
                          ),
                        ])),
                  ]),
                  _: 1,
                }),
              ])
            );
          }
        );
      },
    }),
    [['__scopeId', 'data-v-84ecac92']],
  ),
  H = y(K);
for (const [Y, Z] of Object.entries(C)) H.component(Y, Z);
y(K).mount('#app');
