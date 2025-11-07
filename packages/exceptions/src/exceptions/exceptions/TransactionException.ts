import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import {
  parseErrorMessage,
  mapFailedTransactionMessage,
} from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js'

export class TransactionException extends ConcreteException {
  public static errorClass: string = 'TransactionException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)
    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message, context, contextModule, contextCode } = this

    // If skipParsing is true, just use the raw message
    if (this.skipParsing) {
      this.setContext(context || 'Unknown')
      this.setMessage(message)
      this.setOriginalMessage(message)
      this.setName(TransactionException.errorClass)

      return
    }

    const {
      code,
      message: parsedMessage,
      contextModule: parsedContextModule,
    } = mapFailedTransactionMessage(message, { contextCode, contextModule })

    this.setContext(context || 'Unknown')
    this.setMessage(parsedMessage)
    this.setContextCode(code)
    this.setOriginalMessage(parseErrorMessage(message))

    if (parsedContextModule) {
      this.setContextModule(parsedContextModule)
    }

    this.setName(TransactionException.errorClass)
  }
}
