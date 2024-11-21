const fs = require('fs');
const path = require('path');
const { getPathAbsoluteRoot } = require('../utils/file');
const _log = require('../utils/logger');
const buildMp = require('../tools/buildMp');
const url = require('url');
const { getLocalIP } = require('../utils/common');
const { getMpsAppJson, getProjectPackage } = require('./../tools/getProjectJson');

const hostIP = getLocalIP();
const mpsJson = getMpsAppJson();
const port = mpsJson.port || 3000;

let postMessageEvent;
const qrcodeMap = new Map();

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

const registerWebRouteRequest = ({ res, filePath }) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('服务器内部错误');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    }
  });
};

const registerStaticRequest = ({ res, req }) => {
  const filePath = getPathAbsoluteRoot(req.url);
  const ext = path.extname(filePath);

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
};

const registerHttpError = ({ res, req, code, msg }) => {
  _log.error(`${req.method}请求${req.url}地址错误，请检测接口url是否写错`, 'HTTP');
  res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(msg);
};

const createResponse = ({ code = 0, data, msg = 'success' }) => {
  return JSON.stringify({
    code,
    data,
    msg,
  });
};

const parseBodyParam = (contentType, body) => {
  let parsedData;
  if (contentType === 'application/json') {
    parsedData = JSON.parse(body);
  } else if (contentType === 'application/x-www-form-urlencoded') {
    parsedData = new URLSearchParams(body);
  } else {
    parsedData = body;
  }

  return parsedData;
};

const sendMessage = (data) => {
  postMessageEvent && postMessageEvent.write(`data: ${JSON.stringify(data)}\n\n`);
};

const postMessage = ({ req, res }) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  postMessageEvent = res;
  sendMessage({ message: 'postEvent connect success' });

  req.on('close', () => {
    res.end();
  });
};

const getBaseInfo = ({ res }) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  const response = createResponse({
    data: {
      projectName: process.env.projectName,
      version: process.env.version,
    },
  });
  res.end(response);
};

const getQrcode = ({ req, res }) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const taskId = query.id;
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  const qrcode = qrcodeMap.get(taskId);
  const response = createResponse({
    data: qrcode ? qrcode : null,
  });
  res.end(response);
};

const postBuildInfo = ({ req, res }) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const params = parseBodyParam(req.headers['content-type'], body);
    params.version = params.version || getProjectPackage().version;
    _log.info(`${req.url} 请求参数: ${JSON.stringify(params)}`, 'HTTP');
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
    });
    const response = createResponse({
      data: {
        message: 'build start',
      },
    });
    buildMp(params, true);
    res.end(response);
  });
};

module.exports = {
  registerStaticRequest,
  registerWebRouteRequest,
  registerHttpError,
  sendMessage,
  qrcodeMap,
  serverInfo: {
    hostIP,
    port,
  },
  apis: {
    '/api/message': postMessage,
    '/api/getBaseInfo': getBaseInfo,
    '/api/postBuildInfo': postBuildInfo,
    '/api/getQrcode': getQrcode,
  },
};
