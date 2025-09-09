import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js';

const removeTrustWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('Trust Wallet', '')
    .replaceAll('TrustWallet', '')
    .replaceAll('Trustwallet', '')
    .replaceAll('TrustWallet:', '')
    .replaceAll('Trust Wallet:', '')

export class TrustWalletException extends ConcreteException {
  public static errorClass: string = 'TrustWalletException'

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
      this.setMessage('Please make sure you are using TrustWallet')
    } else {
      this.setMessage(
        mapErrorMessage(removeTrustWalletFromErrorString(message)),
      )
    }

    this.setName(TrustWalletException.errorClass)
  }
}
