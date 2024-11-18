enum LogLevel {
  DONE = 'done',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  LOG = 'log',
  LINK = 'link',
}

interface ILog {
  message: string;
  level: LogLevel;
}

export { LogLevel };
export type { ILog };
