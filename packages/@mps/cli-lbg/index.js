const fs = require('fs');
const path = require('path');

exports.lbg = {
  getLbgNoticeTaskTemp: (cliPath) =>
    fs.readFileSync(path.join(cliPath, '/templates/lbg-noticeTask.js'), 'utf-8'),
};
