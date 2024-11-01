import { ConcreteException } from '../base'

import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '')

export class MetamaskException extends ConcreteException {
  public errorClass: string = 'MetamaskException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parse(): void {
    const { message } = this

    this.setMessage(mapMetamaskMessage(removeMetamaskFromErrorString(message)))
  }
}
