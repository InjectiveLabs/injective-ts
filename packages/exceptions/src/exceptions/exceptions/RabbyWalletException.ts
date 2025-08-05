import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import { ErrorContext, ErrorType } from '../types/index.js'

const removeRabbyWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('RabbyWallet', '')
    .replaceAll('Rabby Wallet', '')
    .replaceAll('Rabbywallet', '')
    .replaceAll('RabbyWallet:', '')
    .replaceAll('Rabby Wallet:', '')

export class RabbyWalletException extends ConcreteException {
  public static errorClass: string = 'RabbyWalletException'

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
      this.setMessage('Please make sure you are using Rabby Wallet')
    } else {
      this.setMessage(
        mapErrorMessage(removeRabbyWalletFromErrorString(message)),
      )
    }

    this.setName(RabbyWalletException.errorClass)
  }
}
