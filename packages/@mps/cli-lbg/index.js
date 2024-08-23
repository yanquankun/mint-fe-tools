const fs = require('fs');
const path = require('path');

exports.lbg = {
  getLbgNoticeTaskTemp: (lbgCliPath) =>
    fs.readFileSync(path.join(lbgCliPath, '/templates/lbg-noticeTask.js'), 'utf-8'),
};
