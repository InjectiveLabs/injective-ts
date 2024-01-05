import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

const removeTrustWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('TrustWallet', '')
    .replaceAll('Trust Wallet', '')
    .replaceAll('Trustwallet', '')
    .replaceAll('TrustWallet:', '')
    .replaceAll('Trust Wallet:', '')

export class TrustWalletException extends ConcreteException {
  public errorClass: string = 'TrustWalletException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    this.setMessage(
      mapMetamaskMessage(removeTrustWalletFromErrorString(message)),
    )
  }
}
