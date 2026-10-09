const chalk = require('chalk');
const { clack } = require('./terminal');
const readline = require('readline');
const EventEmitter = require('events');
const events = new EventEmitter();
const fs = require('fs');

function _log(type, tag, message) {
  if (message) {
    const { sendMessage } = require('../lib/http');
    typeof sendMessage === 'function' &&
      sendMessage({
        level: type,
        message: message,
      });

    events.emit('log', {
      message,
      type,
      tag,
    });
  }
}

const format = (tag, msg) =>
  `${tag ? `[${tag}] ` : ''}${msg instanceof Error ? msg.stack : String(msg)}`;

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

module.exports = {
  chalk,
  chalkTag,
  emitLog: _log,
  log: (msg = '', tag = null) => {
    clack.log.message(format(tag, msg));
    _log('log', tag, msg);
  },
  info: (msg, tag = null) => {
    clack.log.info(format(tag, msg));
    _log('info', tag, msg);
  },
  done: (msg, tag = null) => {
    clack.log.success(format(tag, msg));
    _log('done', tag, msg);
  },
  warn: (msg, tag = null) => {
    clack.log.warn(format(tag, msg));
    _log('warn', tag, msg);
  },
  error: (msg, tag = null) => {
    clack.log.error(format(tag, msg));
    _log('error', tag, msg instanceof Error ? msg.stack : msg);
  },
  clearConsole: (title) => {
    if (process.stdout.isTTY) {
      const blank = '\n'.repeat(process.stdout.rows);
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      if (title) {
        console.log(title);
      }
    }
  },
  writeLog: async (capturedFileName) => {
    events.on('log', (data) => {
      const text = JSON.stringify(data) + '\n';
      fs.appendFileSync(capturedFileName, text, 'utf8', (err) => {
        if (err) {
          exports.error('写入文件时发生错误:' + err, 'writeLog');
        }
      });
    });
  },
};
