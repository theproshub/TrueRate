type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  msg: string;
  [key: string]: unknown;
}

const isProd = process.env.NODE_ENV === 'production';

function emit(entry: LogEntry) {
  const line = isProd
    ? JSON.stringify(entry)
    : `[${entry.level.toUpperCase()}] ${entry.msg}${Object.keys(entry).length > 2 ? ' ' + JSON.stringify(Object.fromEntries(Object.entries(entry).filter(([k]) => k !== 'level' && k !== 'msg'))) : ''}`;

  if (entry.level === 'error') console.error(line);
  else if (entry.level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info(msg: string, data?: Record<string, unknown>) {
    emit({ level: 'info', msg, ...data });
  },
  warn(msg: string, data?: Record<string, unknown>) {
    emit({ level: 'warn', msg, ...data });
  },
  error(msg: string, data?: Record<string, unknown>) {
    emit({ level: 'error', msg, ...data });
  },
};
