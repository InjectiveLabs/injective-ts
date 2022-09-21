import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'
import { mapMetamaskMessage } from '../utils/maps'

const removeMetamaskFromErrorString = (message: string): string =>
  message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '')

export class MetamaskException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parseMessage(): void {
    const { message } = this

    this.setMessage(mapMetamaskMessage(removeMetamaskFromErrorString(message)))
  }
}
