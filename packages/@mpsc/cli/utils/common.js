const os = require('os');
const { spawn } = require('child_process');

const timestampToTime = (timestamp) => {
  timestamp = timestamp ? timestamp : null;
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '_';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};

const checkVersion = (version) => {
  const versionRegex = /^(0|[1-9]\d*)(\.(0|[1-9]\d*))*$/;
  return versionRegex.test(version);
};

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function openUrlWithBrowser(url) {
  const openCommand =
    process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';

  spawn(openCommand, [url]);
}

module.exports = {
  timestampToTime,
  checkVersion,
  getLocalIP,
  guid,
  openUrlWithBrowser,
};
