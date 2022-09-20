import { Exception } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class CosmosWalletException extends Exception {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  // eslint-disable-next-line class-methods-use-this
  protected parseMessage(): void {
    //
  }
}
