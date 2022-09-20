import { Exception } from '../exception'
import { ErrorContext, ErrorType } from '../types'

export class Web3Exception extends Exception {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.Web3
  }

  // eslint-disable-next-line class-methods-use-this
  protected parseMessage(): void {
    //
  }
}
