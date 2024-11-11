import { ConcreteException } from '../base'
import { ErrorContext, ErrorType } from '../types'

export class CosmosWalletException extends ConcreteException {
  public static errorClass: string = 'CosmosWalletException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    this.setName(CosmosWalletException.errorClass)
  }
}
