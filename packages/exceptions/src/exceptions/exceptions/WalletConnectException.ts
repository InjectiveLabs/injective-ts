import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js'

const removeWalletConnectFromErrorString = (message: string): string =>
  message
    .replaceAll('WalletConnect', '')
    .replaceAll('WalletConnect', '')
    .replaceAll('WalletConnect:', '')

export class WalletConnectException extends ConcreteException {
  public static errorClass: string = 'WalletConnectException'

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
      this.setMessage('Please make sure you are using WalletConnect')
    } else {
      this.setMessage(
        mapErrorMessage(removeWalletConnectFromErrorString(message)),
      )
    }

    this.setName(WalletConnectException.errorClass)
  }
}
