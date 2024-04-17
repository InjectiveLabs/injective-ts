import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapFailedTransactionMessage, parseErrorMessage } from '../utils/maps'

export class TransactionException extends ConcreteException {
  public errorClass: string = 'TransactionException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message, contextModule, contextCode } = this

    console.log({ message, contextModule, contextCode })

    const {
      code,
      message: parsedMessage,
      contextModule: parsedContextModule,
    } = mapFailedTransactionMessage(message, { contextCode, contextModule })

    this.setMessage(parsedMessage)
    this.setContextCode(code)
    this.setOriginalMessage(parseErrorMessage(message))

    if (parsedContextModule) {
      this.setContextModule(parsedContextModule)
    }
  }
}
