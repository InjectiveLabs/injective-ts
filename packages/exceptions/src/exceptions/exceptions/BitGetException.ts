import { ErrorType } from '../types/index.js'
import { ConcreteException } from '../base.js'
import { mapErrorMessage } from '../utils/maps.js'
import type { ErrorContext } from '../types/index.js'

const removeBitGetFromErrorString = (message: string): string =>
  message
    .replaceAll('BitGet', '')
    .replaceAll('Bitget:', '')
    .replaceAll('Bitkeep:', '')

export class BitGetException extends ConcreteException {
  public static errorClass: string = 'BitGetException'

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
      this.setMessage('Please make sure you are using BitGet Wallet')
    } else {
      this.setMessage(mapErrorMessage(removeBitGetFromErrorString(message)))
    }

    this.setName(BitGetException.errorClass)
  }
}
