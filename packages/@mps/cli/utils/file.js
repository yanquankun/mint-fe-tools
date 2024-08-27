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
};

/**
 * @description 获取路径相对cli根目录的绝对路径
 * @param { string } relativeRootDir 相对cli根目录的路径
 * @return { string }
 */
const getPathAbsoluteRoot = (relativeRootDir) => {
  return path.join(root, relativeRootDir);
};

/**
 * @description 将base64转换为图片
 * @param {*} base64 图片base64
 */
const base64ToImg = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + base64;
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function (e) {
      reject(e);
    };
  });
};

/**
 * @description 将图片转换为base64
 * @param {*} image
 */
const imgToBase64 = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, image.width, image.height);
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
};

module.exports = {
  isExitFile,
  isExitDir,
  writeFileTree,
  getPathAbsoluteRoot,
  root,
  curDir,
  base64ToImg,
  imgToBase64,
};
