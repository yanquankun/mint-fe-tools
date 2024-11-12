enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface ILog {
  message: string;
  level: LogLevel;
}

export { LogLevel };
export type { ILog };
