import {
  d as E,
  r as h,
  D as P,
  o as m,
  b as y,
  e as _,
  Q as U,
  ai as B,
  y as T,
  Z as N,
  K as A,
  I as w,
  V,
  U as l,
  P as n,
  _ as O,
  Y as b,
  a4 as F,
  u as $,
  ab as R,
} from '../vender/third_party-DJ2Afz4E.js';
import {
  E as D,
  a as S,
  b as L,
  c as M,
  d as j,
  e as q,
  v as Q,
  f as W,
  g as z,
  h as G,
  i as H,
  j as K,
  k as Y,
  l as Z,
} from '../vender/element-plus-BZacXLkC.js';
(function () {
  const i = document.createElement('link').relList;
  if (i && i.supports && i.supports('modulepreload')) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) c(e);
  new MutationObserver((e) => {
    for (const o of e)
      if (o.type === 'childList')
        for (const a of o.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && c(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(e) {
    const o = {};
    return (
      e.integrity && (o.integrity = e.integrity),
      e.referrerPolicy && (o.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : e.crossOrigin === 'anonymous'
        ? (o.credentials = 'omit')
        : (o.credentials = 'same-origin'),
      o
    );
  }
  function c(e) {
    if (e.ep) return;
    e.ep = !0;
    const o = s(e);
    fetch(e.href, o);
  }
})();
var v = ((r) => (
  (r.DEBUG = 'debug'), (r.INFO = 'info'), (r.WARN = 'warn'), (r.ERROR = 'error'), r
))(v || {});
const J = { class: 'logger-ui' },
  X = { class: 'logger-output-time' },
  ee = E({
    __name: 'Log',
    setup(r, { expose: i }) {
      const s = h(null),
        c = h([]),
        e = {
          [v.INFO]: 'logger-output-info',
          [v.WARN]: 'logger-output-warn',
          [v.ERROR]: 'logger-output-error',
          [v.DEBUG]: 'logger-output-debug',
        };
      i({
        clear: () => {
          c.value = [
            { time: new Date().toLocaleTimeString(), level: v.INFO, message: '小程序构建日志监控' },
          ];
        },
        startWatch: () => {
          d({ level: v.INFO, message: '开始监听构建日志' });
        },
      });
      const d = (p) => {
          c.value.push({
            time: new Date().toLocaleTimeString(),
            level: p.level,
            message: p.message,
          }),
            t();
        },
        t = async () => {
          await T(), s.value && (s.value.scrollTop = s.value.scrollHeight);
        };
      return (
        P(() => {
          d({ level: v.INFO, message: '小程序构建日志监控' });
        }),
        (p, f) => (
          m(),
          y('div', J, [
            _(
              'div',
              { class: 'logger-output', ref_key: 'logOutput', ref: s },
              [
                (m(!0),
                y(
                  U,
                  null,
                  B(
                    c.value,
                    (g, x) => (
                      m(),
                      y('p', { key: x }, [
                        _('span', X, N(g.time), 1),
                        _('span', { class: A(e[g.level]) }, N(g.message), 3),
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
  k = (r, i) => {
    const s = r.__vccOpts || r;
    for (const [c, e] of i) s[c] = e;
    return s;
  },
  te = k(ee, [['__scopeId', 'data-v-16dbec37']]),
  oe = (r) => /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/.test(r),
  ne = E({
    __name: 'Config',
    emits: ['clearPage', 'startBuild'],
    setup(r, { emit: i }) {
      const s = h(),
        c = w({
          desc: [{ required: !0, message: '请输入描述', trigger: 'blur' }],
          version: [
            {
              validator: (d, t, p) => {
                t && !oe(t)
                  ? p(new Error('格式为[x.[y.[z]]]，不填则以package.json的version字段为准!'))
                  : p();
              },
              trigger: 'blur',
            },
          ],
        }),
        e = w({
          desc: '',
          version: '',
          groupNotice: !1,
          isProd: !1,
          isAutoUpdateQrcode: !1,
          isCreateTag: !1,
        }),
        o = i,
        a = async (d) => {
          d &&
            (await d.validate((t) => {
              t ? o('startBuild') : D.warning('请完善表单信息!');
            }));
        };
      return (d, t) => {
        const p = S,
          f = L,
          g = M,
          x = j,
          I = q;
        return (
          m(),
          V(
            I,
            {
              ref_key: 'configFormRef',
              ref: s,
              model: e,
              rules: c,
              'label-width': '200px',
              style: { 'max-width': '600px' },
              'status-icon': '',
              class: 'config-form',
            },
            {
              default: l(() => [
                n(
                  f,
                  { prop: 'desc', label: '输入描述' },
                  {
                    default: l(() => [
                      n(
                        p,
                        {
                          maxlength: '100',
                          type: 'textarea',
                          resize: 'none',
                          rows: 4,
                          placeholder: '请输入描述',
                          modelValue: e.desc,
                          'onUpdate:modelValue': t[0] || (t[0] = (u) => (e.desc = u)),
                        },
                        null,
                        8,
                        ['modelValue'],
                      ),
                    ]),
                    _: 1,
                  },
                ),
                n(
                  f,
                  { prop: 'version', label: '输入版本' },
                  {
                    default: l(() => [
                      n(
                        p,
                        {
                          maxlength: '20',
                          placeholder: '请输入版本',
                          modelValue: e.version,
                          'onUpdate:modelValue': t[1] || (t[1] = (u) => (e.version = u)),
                        },
                        null,
                        8,
                        ['modelValue'],
                      ),
                    ]),
                    _: 1,
                  },
                ),
                n(
                  f,
                  { prop: 'groupNotice', label: '是否发送群通知' },
                  {
                    default: l(() => [
                      n(
                        g,
                        {
                          modelValue: e.groupNotice,
                          'onUpdate:modelValue': t[2] || (t[2] = (u) => (e.groupNotice = u)),
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
                n(
                  f,
                  { prop: 'isProd', label: '是否为发布版本' },
                  {
                    default: l(() => [
                      n(
                        g,
                        {
                          modelValue: e.isProd,
                          'onUpdate:modelValue': t[3] || (t[3] = (u) => (e.isProd = u)),
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
                e.isProd
                  ? O('', !0)
                  : (m(),
                    V(
                      f,
                      { key: 0, prop: 'isAutoUpdateQrcode', label: '是否自动更新本地版二维码 ' },
                      {
                        default: l(() => [
                          n(
                            g,
                            {
                              modelValue: e.isAutoUpdateQrcode,
                              'onUpdate:modelValue':
                                t[4] || (t[4] = (u) => (e.isAutoUpdateQrcode = u)),
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
                e.isProd
                  ? (m(),
                    V(
                      f,
                      { key: 1, prop: 'isCreateTag', label: '是否打tag' },
                      {
                        default: l(() => [
                          n(
                            g,
                            {
                              modelValue: e.isCreateTag,
                              'onUpdate:modelValue': t[5] || (t[5] = (u) => (e.isCreateTag = u)),
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
                  : O('', !0),
                n(f, null, {
                  default: l(() => [
                    n(
                      x,
                      {
                        class: 'config-form-clear',
                        onClick: t[6] || (t[6] = (u) => o('clearPage')),
                      },
                      { default: l(() => t[8] || (t[8] = [b('清空页面内容')])), _: 1 },
                    ),
                    n(
                      x,
                      {
                        class: 'config-form-submit',
                        type: 'primary',
                        onClick: t[7] || (t[7] = (u) => a(s.value)),
                      },
                      { default: l(() => t[9] || (t[9] = [b('开始构建')])), _: 1 },
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
  se = k(ne, [['__scopeId', 'data-v-df344bd6']]),
  ae = {
    'element-loading-text': '查询中...',
    'element-loading-background': 'rgba(122, 122, 122, 0.4)',
    class: 'container',
  },
  le = { key: 1, class: 'container-qrcode' },
  re = E({
    __name: 'Result',
    setup(r) {
      const i = h(!1),
        s = h();
      return (c, e) => {
        let d;
        const o = W,
          a = Q;
        return F(
          (m(),
          y('div', ae, [
            (d = s.value) != null && d.length
              ? (m(), y('div', le))
              : (m(), V(o, { key: 0, description: '暂无数据' })),
          ])),
          [[a, i.value]],
        );
      };
    },
  }),
  ie = k(re, [['__scopeId', 'data-v-9d928d00']]),
  ce = { class: 'container' },
  de = { class: 'container-header-operations' },
  ue = { key: 0 },
  pe = { key: 1, class: 'container-result' },
  me = E({
    __name: 'App',
    setup(r) {
      const i = new URLSearchParams(location.search).get('id') || '',
        s = h(null),
        c = () => {
          s.value && s.value.startWatch();
        },
        e = () => {
          s.value && s.value.clear();
        };
      return (
        P(() => {
          fetch('/api/getMessage', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
            .then((o) => o.json())
            .then((o) => {
              console.log('服务器返回:', o);
            })
            .catch((o) => console.error('请求出错:', o));
        }),
        (o, a) => {
          const d = G,
            t = H,
            p = K,
            f = Y,
            g = z;
          return (
            m(),
            y('div', ce, [
              n(g, null, {
                default: l(() => [
                  n(
                    t,
                    { height: '50px', class: 'container-header' },
                    {
                      default: l(() => [
                        a[2] ||
                          (a[2] = _(
                            'div',
                            { class: 'container-header-title' },
                            [
                              _('span', null, '小程序 ci 构建脚手架工具'),
                              _('span', { class: 'container-header-title-line' }, '|'),
                              _('span', { class: 'container-header-title-extra' }, '0.0.1'),
                              _('span', { class: 'container-header-title-line' }, '|'),
                              _('span', { class: 'container-header-title-extra' }, 'banma_mp'),
                            ],
                            -1,
                          )),
                        _('div', de, [
                          n(
                            d,
                            {
                              type: 'primary',
                              href: 'https://github.com/yanquankun/mint-fe-tools/blob/feature/v0.0.5/packages/%40mpsc/cli/README.md',
                              target: '_blank',
                            },
                            { default: l(() => a[0] || (a[0] = [b('使用手册')])), _: 1 },
                          ),
                          n(
                            d,
                            {
                              type: 'primary',
                              href: 'https://github.com/yanquankun/mint-fe-tools/issues',
                              target: '_blank',
                            },
                            { default: l(() => a[1] || (a[1] = [b('问题反馈')])), _: 1 },
                          ),
                        ]),
                      ]),
                      _: 1,
                    },
                  ),
                  $(i)
                    ? (m(), y('div', pe, [n(ie)]))
                    : (m(),
                      y('div', ue, [
                        n(
                          p,
                          { 'content-position': 'left', 'border-style': 'dashed' },
                          { default: l(() => a[3] || (a[3] = [b('构建选项')])), _: 1 },
                        ),
                        n(
                          f,
                          { class: 'container-config' },
                          { default: l(() => [n(se, { onStartBuild: c, onClearPage: e })]), _: 1 },
                        ),
                        n(
                          p,
                          { 'content-position': 'left', 'border-style': 'dashed' },
                          { default: l(() => a[4] || (a[4] = [b('输出日志')])), _: 1 },
                        ),
                        n(
                          f,
                          { class: 'container-log' },
                          {
                            default: l(() => [n(te, { ref_key: 'logger', ref: s }, null, 512)]),
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
  C = k(me, [['__scopeId', 'data-v-84ecac92']]),
  fe = R(C);
for (const [r, i] of Object.entries(Z)) fe.component(r, i);
R(C).mount('#app');
