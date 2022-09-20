import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class TrezorException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }
}
