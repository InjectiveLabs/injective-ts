import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL,
      format: winston.format.simple(),
    }),
  ],
})
