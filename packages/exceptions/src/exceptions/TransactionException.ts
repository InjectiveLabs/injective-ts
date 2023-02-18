import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapFailedTransactionMessage } from '../utils/maps'

export class TransactionException extends ConcreteException {
  public errorClass: string = 'TransactionException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message, contextModule, contextCode } = this

    const {
      code,
      contextModule: parsedContextModule,
      message: parsedMessage,
    } = mapFailedTransactionMessage(message, { contextCode, contextModule })

    this.setMessage(parsedMessage)
    this.setContextCode(code)

    if (parsedContextModule) {
      this.setContextModule(parsedContextModule)
    }
  }
}
