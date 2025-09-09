import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext} from '../types/index.js';

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Rainbow', '')
    .replaceAll('RainBow', '')
    .replaceAll('Rainbow:', '')

export class RainbowWalletException extends ConcreteException {
  public static errorClass: string = 'RainbowWalletException'

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
      this.setMessage('Please make sure you are using Rainbow Wallet')
    } else {
      this.setMessage(mapErrorMessage(removeMetamaskFromErrorString(message)))
    }

    this.setName(RainbowWalletException.errorClass)
  }
}
