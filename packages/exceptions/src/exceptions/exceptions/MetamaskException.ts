import { ConcreteException } from '../base.js'
import { ErrorContext, ErrorType } from '../types/index.js'
import { mapMetamaskMessage } from '../utils/maps.js'

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '')

export class MetamaskException extends ConcreteException {
  public static errorClass: string = 'MetamaskException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    this.setMessage(mapMetamaskMessage(removeMetamaskFromErrorString(message)))

    this.setName(MetamaskException.errorClass)
  }
}
