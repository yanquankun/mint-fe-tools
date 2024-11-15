const http = require('http');
const fs = require('fs');
const url = require('url');
const { getLocalIP } = require('../utils/common');
const _log = require('../utils/logger');
const { getPathAbsoluteRoot } = require('../utils/file');
const path = require('path');
const { getMpsAppJson } = require('./../tools/getProjectJson');

const hostIP = getLocalIP();
const mpsJson = getMpsAppJson();
const port = mpsJson.port || 3000;
let message = '',
  server;

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
      if (req.method === 'GET' && req.url === `/${process.env.projectName}`) {
        const filePath = getPathAbsoluteRoot('static/index.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('服务器内部错误');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
          }
        });
      } else if (req.method === 'GET' && req.url.startsWith('/static/')) {
        const filePath = getPathAbsoluteRoot(req.url);
        const ext = path.extname(filePath);

        const mimeTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
        };
        const contentType = mimeTypes[ext];
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('服务器内部错误');
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
          }
        });
      } else if (req.method === 'POST' || req.method === 'GET') {
        if (req.url == '/api/message') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            console.log('收到消息:', body);
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
            });
            const response = JSON.stringify({
              message: 'Message received successfully!',
            });
            message = response;
            res.end(response);
          });
        }
        if (req.url == '/api/getMessage') {
          const queryObject = url.parse(req.url, true).query;

          console.log('收到参数:', queryObject);
          console.log('发送消息：', message || { data: '' });

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(message || JSON.stringify({ data: '' }));
        }
        if (req.url == '/api/getBaseInfo') {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(
            message ||
              JSON.stringify({
                code: 0,
                msg: 'success',
                data: {
                  projectName: process.env.projectName,
                  version: process.env.version,
                },
              }),
          );
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
      }
    });

    startHttpWatch();
  } catch (e) {
    _log.error(e, 'createServer');
  }
})();
