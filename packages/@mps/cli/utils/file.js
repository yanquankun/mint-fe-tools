const fs = require('fs');
const _log = require('./logger');

/**
 * @description 根据路径判断文件是否存在
 * @param { String } path 文件路径
 * @return { Boolean }
 */
const isExitFile = (path, isDebug = false) => {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
    return false;
  } catch (err) {
    isDebug && _log.warn(err, isExitFile);
    return false;
  }
};

/**
 * @description 根据路径判断文件夹是否存在
 * @param { String } path 目录路径
 * @return { Boolean }
 */
const isExitDir = (path, isDebug = false) => {
  try {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      return true;
    }
    return false;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    isDebug && _log.warn(error, isExitDir);
    return false;
  }
};

module.exports = {
  isExitFile,
  isExitDir,
};
