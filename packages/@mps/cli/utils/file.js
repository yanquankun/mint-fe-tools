const fs = require('fs-extra');
const _log = require('./logger');
const path = require('path');
const { isString, isArray } = require('./type');

const curDir = __dirname;
const root = path.dirname(__dirname);

/**
 * @description 根据路径判断文件是否存在
 * @param { String } dir 文件路径
 * @return { Boolean }
 */
const isExitFile = (dir, isDebug = false) => {
  try {
    if (fs.existsSync(dir)) {
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
 * @param { String } dir 目录路径
 * @return { Boolean }
 */
const isExitDir = (dir, isDebug = false) => {
  try {
    const stats = fs.statSync(dir);
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

/**
 * @description 写入模板文件到内存
 * @param {string} dir 文件路径
 * @param {Array<File>} files 文件内容
 */
const writeFileTree = async (dir, files) => {
  if (!isString(dir)) {
    _log.warn(`模板写入路径 ${dir} 不合法`, 'writeFileTree');
    return;
  }

  if (!isArray(files)) {
    _log.warn(`模板写入内容 ${files} 不合法`, 'writeFileTree');
    return;
  }

  files.forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name] || '');
  });

  _log.done('.mps目录创建成功', 'writeFileTree');
};

/**
 * 2024-08-21 20:09:57
 * @author Mint.Yan
 * @description 获取路径相对cli根目录的绝对路径
 * @param { string } relativeRootDir 相对cli根目录的路径
 * @return { string }
 */
const getPathAbsoluteRoot = (relativeRootDir) => {
  return path.join(root, relativeRootDir);
};

module.exports = {
  isExitFile,
  isExitDir,
  writeFileTree,
  getPathAbsoluteRoot,
  root,
  curDir,
};
