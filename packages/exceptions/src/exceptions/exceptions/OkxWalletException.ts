import { ConcreteException } from '../base'

import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

const removeOkxWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('OkxWallet', '')
    .replaceAll('Okx', '')
    .replaceAll('OkxWallet:', '')

export class OkxWalletException extends ConcreteException {
  public static errorClass: string = 'OkxWalletException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    this.setMessage(mapMetamaskMessage(removeOkxWalletFromErrorString(message)))

    this.setName(OkxWalletException.errorClass)
  }
}
