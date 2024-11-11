import { ConcreteException } from '../base'

import { ErrorContext, ErrorType } from '../types'

export class TrezorException extends ConcreteException {
  public static errorClass: string = 'TrezorException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    this.setName(TrezorException.errorClass)
  }
}
