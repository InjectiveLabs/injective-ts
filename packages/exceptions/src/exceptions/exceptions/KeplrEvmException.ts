import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js'

const removeKeplrFromErrorString = (message: string): string =>
  message
    .replaceAll('Keplr', '')
    .replaceAll('Keplr', '')
    .replaceAll('Keplr:', '')

export class KeplrEvmException extends ConcreteException {
  public static errorClass: string = 'KeplrException'

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
      this.setMessage('Please make sure you are using Keplr Wallet')
    } else {
      this.setMessage(mapErrorMessage(removeKeplrFromErrorString(message)))
    }

    this.setName(KeplrEvmException.errorClass)
  }
}
