import { ConcreteException } from '../base.js'
import { ErrorContext, ErrorType } from '../types/index.js'
import { mapMetamaskMessage } from '../utils/maps.js'

const removeTrustWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('TrustWallet', '')
    .replaceAll('Trust Wallet', '')
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

    this.setMessage(
      mapMetamaskMessage(removeTrustWalletFromErrorString(message)),
    )

    this.setName(TrustWalletException.errorClass)
  }
}
