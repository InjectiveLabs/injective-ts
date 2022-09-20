import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapFailedTransactionMessage } from '../utils/maps'

export class TransactionException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message } = this

    const { message: parsedMessage, code } =
      mapFailedTransactionMessage(message)

    this.setMessage(parsedMessage)
    this.setContextCode(code)
  }
}
