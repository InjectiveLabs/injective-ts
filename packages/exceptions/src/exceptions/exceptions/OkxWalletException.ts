import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext} from '../types/index.js';

const removeOkxWalletFromErrorString = (message: string): string =>
  message
    .replaceAll('OkxWallet', '')
    .replaceAll('OkxWallet:', '')
    .replaceAll('Okx', '')

export class OkxWalletException extends ConcreteException {
  public static errorClass: string = 'OkxWalletException'

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
      this.setMessage('Please make sure you are using Okx Wallet')
    } else {
      this.setMessage(mapErrorMessage(removeOkxWalletFromErrorString(message)))
    }

    this.setName(OkxWalletException.errorClass)
  }
}
