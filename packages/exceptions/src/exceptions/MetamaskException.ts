import { Exception } from '../exception'
import { ErrorContext, ErrorType } from '../types'

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '')

export class MetamaskException extends Exception {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  protected parseMessage(): void {
    const { message } = this

    this.message = removeMetamaskFromErrorString(message)
  }
}
