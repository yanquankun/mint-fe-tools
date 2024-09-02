const execa = require('execa');
const _log = require('../utils/logger');
const { timestampToTime } = require('../utils/common');

module.exports = {
  getUser: async () => {
    try {
      const { stdout } = await execa('git', ['config', 'user.name'], {
        // 运行命令时使用的当前工作目录
        cwd: process.cwd(),
      });
      return stdout;
    } catch (error) {
      _log.error(error, 'getUser');
      process.exit(1);
    }
  },
  getBranch: async () => {
    try {
      const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'], {
        cwd: process.cwd(),
      });
      return stdout;
    } catch (error) {
      _log.error(error, 'getBranch');
      process.exit(1);
    }
  },
  getRemote: async () => {
    try {
      const { stdout } = await execa('git', ['config', 'remote.origin.url'], {
        cwd: process.cwd(),
      });
      return stdout;
    } catch (error) {
      _log.error(error, 'getRemote');
      process.exit(1);
    }
  },
  getCommit: async () => {
    try {
      const { stdout: author } = await execa('git', ['log', '-1', '--pretty=format:%cn'], {
        cwd: process.cwd(),
      });
      const { stdout: date } = await execa(
        'git',
        ['log', '-1', '--pretty=format:%ad', '--date=format:%Y-%m-%d_%H:%M:%S'],
        {
          cwd: process.cwd(),
        },
      );
      const { stdout: commit } = await execa('git', ['log', '-1', '--pretty=format:%s'], {
        cwd: process.cwd(),
      });
      return `${timestampToTime(+new Date())}-${author}-${date}-${commit.trim()}`.replace(
        /\s|:/g,
        '',
      );
    } catch (error) {
      _log.error(error, 'getCommit');
      process.exit(1);
    }
  },
};
