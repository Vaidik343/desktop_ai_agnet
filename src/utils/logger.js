const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/agent-%DATE%.log',   // logs folder, file per day
  datePattern: 'YYYY-MM-DD',           // daily rotation
  zippedArchive: true,                 // compress old logs
  maxSize: '20m',                      // max size per file
  maxFiles: '7d'                       // keep logs for 7 days
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    dailyRotateFileTransport
  ]
});

module.exports = logger;
