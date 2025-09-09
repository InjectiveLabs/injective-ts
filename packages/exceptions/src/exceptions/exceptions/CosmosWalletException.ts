import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import type { ErrorContext} from '../types/index.js';

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
