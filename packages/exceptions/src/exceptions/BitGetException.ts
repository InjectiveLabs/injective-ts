import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

const removeBitGetFromErrorString = (message: string): string =>
  message
    .replaceAll('BitGet', '')
    .replaceAll('Bitget:', '')
    .replaceAll('Bitkeep:', '')

export class BitGetException extends ConcreteException {
  public errorClass: string = 'BitGetException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    this.setMessage(mapMetamaskMessage(removeBitGetFromErrorString(message)))
  }
}
