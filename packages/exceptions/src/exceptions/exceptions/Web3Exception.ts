import { ConcreteException } from '../base'

import { ErrorContext, ErrorType } from '../types'

export class Web3Exception extends ConcreteException {
  public errorClass: string = 'Web3Exception'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.Web3
  }
}
