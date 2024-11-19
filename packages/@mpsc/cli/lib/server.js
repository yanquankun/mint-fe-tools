const http = require('http');
const _log = require('../utils/logger');
const { getPathAbsoluteRoot } = require('../utils/file');
const {
  registerStaticRequest,
  registerWebRouteRequest,
  registerHttpError,
  apis,
} = require('./http');
const { serverInfo } = require('./http');
const { openUrlWithBrowser } = require('../utils/common');

let server;

const startHttpWatch = function () {
  if (!server) return;

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      _log.error('服务地址已被占用，请检查并关掉其他服务', 'createServer');
    } else {
      _log.error(e, 'createServer');
    }
  });

  server.listen(serverInfo.port, serverInfo.hostIP, () => {
    const url = `http://${serverInfo.hostIP}:${serverInfo.port}/${process.env.projectName}`;
    try {
      openUrlWithBrowser(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      _log.error('打开默认浏览器失败，请手动点击下面地址进行访问', 'BROWSER');
    }
    _log.info(`开启服务，访问 ${_log.chalk.blue(url)}`, 'createServer');
    _log.warn(`在局域网内其他设备可以访问此页面【使用期间请不要关闭该窗口】`, 'createServer');
  });
};

!(function () {
  try {
    server = http.createServer((req, res) => {
      if (req.url.startsWith(`/${process.env.projectName}`)) {
        registerWebRouteRequest({
          res,
          filePath: getPathAbsoluteRoot('static/index.html'),
        });
      } else if (req.url.startsWith('/static/')) {
        registerStaticRequest({ res, req });
      } else {
        const apiUrl = req.url.match(/^\/api\/[^?]*/)[0];

        if (apiUrl && apis[apiUrl]) {
          apis[apiUrl]({ req, res });
        } else
          registerHttpError({
            req,
            res,
            code: 404,
            msg: `${req.url} Not Found，请联系yanquankun！`,
          });
      }
    });

    startHttpWatch();
  } catch (e) {
    _log.error(e, 'createServer');
  }
})();
