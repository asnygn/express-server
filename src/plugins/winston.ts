import winston from 'winston'
import 'winston-daily-rotate-file'

const transport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
})

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    (info) => `${info.level}: ${info.timestamp} ${info.message}`
  )
)

const logger = winston.createLogger({
  format: logFormat,
  transports: [new winston.transports.Console(), transport],
})

export default logger
