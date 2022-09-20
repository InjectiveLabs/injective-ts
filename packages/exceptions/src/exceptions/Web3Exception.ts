import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class Web3Exception extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.Web3
  }
}
