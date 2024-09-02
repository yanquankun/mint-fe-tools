const fs = require('fs');
const path = require('path');

exports.lbg = {
  /** 获取lbg-noticeTask模板 */
  getLbgNoticeTaskTemp: (lbgCliPath) =>
    fs.readFileSync(path.join(lbgCliPath, '/templates/lbg-noticeTask.js'), 'utf-8'),
};
