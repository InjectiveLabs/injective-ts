import { mkdirSync } from 'node:fs'
import winston from 'winston'

const DEBUG = process.env.DEBUG === 'true' || process.env.DEBUG === '1'

const MAX_FILE_SIZE = 10_000_000_000 // 10GB

// Configure winston
const winstonLogger = winston.createLogger({
  level: DEBUG ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint({
      depth: Number.POSITIVE_INFINITY,
    }),
  ),
  transports: [
    // Write to all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: MAX_FILE_SIZE,
    }),
    // Write all logs error (and below) to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: MAX_FILE_SIZE,
    }),
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...rest }) => {
          const additionalInfo = rest.additionalInfo
            ? JSON.stringify(rest.additionalInfo, null, 2)
            : ''
          return `${timestamp} ${level}: ${message} ${additionalInfo}`
        }),
      ),
    }),
  ],
})

// Create logs directory if it doesn't exist
try {
  mkdirSync('logs')
} catch {
  // Directory already exists, ignore error
}

// Create a file-only logger instance
const fileOnlyLogger = winston.createLogger({
  level: DEBUG ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint({
      depth: Number.POSITIVE_INFINITY,
    }),
  ),
  transports: [
    // Write to all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: MAX_FILE_SIZE,
    }),
    // Write all logs error (and below) to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: MAX_FILE_SIZE,
    }),
  ],
})

export const logger = {
  // Original methods (logs to both console and file)
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  debug: (message: string, ...optionalParams: any[]) => {
    if (!DEBUG) return
    winstonLogger.debug(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  info: (message: string, ...optionalParams: any[]) => {
    winstonLogger.info(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  warn: (message: string, ...optionalParams: any[]) => {
    winstonLogger.warn(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: (message: string | Error | unknown, ...optionalParams: any[]) => {
    const errorMessage =
      message instanceof Error
        ? message.stack || message.message
        : typeof message === 'string'
        ? message
        : JSON.stringify(message)
    winstonLogger.error(errorMessage, { additionalInfo: optionalParams })
  },

  // New file-only logging methods
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  debugFile: (message: string, ...optionalParams: any[]) => {
    if (!DEBUG) return
    fileOnlyLogger.debug(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  infoFile: (message: string, ...optionalParams: any[]) => {
    fileOnlyLogger.info(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  warnFile: (message: string, ...optionalParams: any[]) => {
    fileOnlyLogger.warn(message, { additionalInfo: optionalParams })
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  errorFile: (message: string | Error | unknown, ...optionalParams: any[]) => {
    const errorMessage =
      message instanceof Error
        ? message.stack || message.message
        : typeof message === 'string'
        ? message
        : JSON.stringify(message)
    fileOnlyLogger.error(errorMessage, { additionalInfo: optionalParams })
  },
}
