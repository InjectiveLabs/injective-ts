import { ConcreteException } from '../base'

import { ErrorContext, ErrorType } from '../types'
import { mapFailedTransactionMessage, parseErrorMessage } from '../utils/maps'

export class TransactionException extends ConcreteException {
  public static errorClass: string = 'TransactionException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message, context, contextModule, contextCode } = this

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
