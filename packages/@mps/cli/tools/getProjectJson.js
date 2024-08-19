const fs = require('fs');
const path = require('path');
const _log = require('../utils/logger');

exports.isMpProject = (isDebug = false) => {
  try {
    const configPath = path.resolve(process.cwd(), 'project.config.json');
    if (fs.existsSync(configPath)) {
      return true;
    }
    return false;
  } catch (error) {
    isDebug && _log.error(error, 'isMpsProject');
    return false;
  }
};

exports.getMpPrejectJson = (dir = '', isDebug = false) => {
  try {
    const configPath = path.resolve(dir || process.cwd(), 'project.config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    return null;
  } catch (error) {
    isDebug && _log.error(error, 'getMpPrejectJson');
    return {};
  }
};
