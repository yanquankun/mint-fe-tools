const http = require('http');
const { getLocalIP } = require('../utils/common');
const _log = require('../utils/logger');
const { getPathAbsoluteRoot } = require('../utils/file');
const { getMpsAppJson } = require('./../tools/getProjectJson');
const {
  registerStaticRequest,
  registerWebRouteRequest,
  registerHttpError,
  apis,
} = require('./http');

const hostIP = getLocalIP();
const mpsJson = getMpsAppJson();
const port = mpsJson.port || 3000;
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

  server.listen(port, hostIP, () => {
    _log.info(
      `开启服务，访问 ${_log.chalk.blue(`http://${hostIP}:${port}/${process.env.projectName} `)}`,
      'createServer',
    );
    _log.warn(`在局域网内其他设备可以访问此页面【使用期间请不要关闭该窗口】`, 'createServer');
  });
};

!(function () {
  try {
    server = http.createServer((req, res) => {
      if (req.url === `/${process.env.projectName}`) {
        registerWebRouteRequest({
          res,
          filePath: getPathAbsoluteRoot('static/index.html'),
        });
      } else if (req.url.startsWith('/static/')) {
        registerStaticRequest({ res, req });
      } else {
        const apiUrl = req.url.match(/^\/api\/[^?]*/)[0];

        if (apis[apiUrl]) {
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
