import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js'

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '')

export class MetamaskException extends ConcreteException {
  public static errorClass: string = 'MetamaskException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    if (
      message
        .trim()
        .toLowerCase()
        .includes('missing or invalid parameters'.toLowerCase())
    ) {
      this.setMessage('Please make sure you are using Metamask Wallet')
    } else {
      this.setMessage(mapErrorMessage(removeMetamaskFromErrorString(message)))
    }

    this.setName(MetamaskException.errorClass)
  }
}
