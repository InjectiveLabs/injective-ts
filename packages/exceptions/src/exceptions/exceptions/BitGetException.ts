import { ConcreteException } from '../base'
import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

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

    this.setName(BitGetException.errorClass)
    this.setMessage(mapMetamaskMessage(removeBitGetFromErrorString(message)))
  }
}
