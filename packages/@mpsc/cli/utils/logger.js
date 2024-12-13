const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
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

const format = (label, msg) => {
  return msg
    .split('\n')
    .map((line, i) => {
      return i === 0
        ? `${label} ${line}`
        : line.padStart(stripAnsi(label).length + line.length + 1);
    })
    .join('\n');
};

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

module.exports = {
  chalk,
  chalkTag,
  emitLog: _log,
  log: (msg = '', tag = null) => {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
    _log('log', tag, msg);
  },
  info: (msg, tag = null) => {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
  },
  done: (msg, tag = null) => {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
  },
  warn: (msg, tag = null) => {
    console.warn(
      format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)),
    );
    _log('warn', tag, msg);
  },
  error: (msg, tag = null) => {
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
    if (msg instanceof Error) {
      console.error(msg.stack);
      _log('error', tag, msg.stack);
    } else _log('error', tag, msg);
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
