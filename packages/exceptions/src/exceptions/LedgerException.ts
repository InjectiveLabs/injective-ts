import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

const isCommonLockedError = (error: string) => {
  const commonMessages = [
    'Ledger device: Incorrect length',
    'Ledger device: INS_NOT_SUPPORTED',
    'Ledger device: CLA_NOT_SUPPORTED',
    'Failed to open the device',
    'Failed to open the device',
    'Ledger Device is busy',
    'UNKNOWN_ERROR',
  ]

  return (
    commonMessages.some((m) => m.includes(error)) ||
    commonMessages
      .map((m) => m.toLowerCase())
      .some((m) => m.includes(error.toLowerCase()))
  )
}

export class LedgerException extends ConcreteException {
  public errorClass: string = 'LedgerException'

  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parseMessage(): void {
    const { message } = this

    if (isCommonLockedError(message)) {
      this.setMessage(
        'Please ensure your Ledger is connected, unlocked and your Ethereum app is open.',
      )
    }

    if (message.includes('No device selected.')) {
      this.setMessage(
        'Please make sure your Ledger device is connected, unlocked and your Ethereum app is open',
      )
    }

    if (message.includes('Unable to set device configuration.')) {
      this.setMessage(
        'Please restart your Ledger device and try connecting again',
      )
    }

    if (message.includes('Cannot read properties of undefined')) {
      this.setMessage('Please make sure your Ledger device is connected')
    }

    if (
      message.includes('Condition of use not satisfied') ||
      message.includes('0x6985')
    ) {
      this.setMessage('The request has been rejected')
    }

    if (message.includes('U2F browser support is needed for Ledger.')) {
      this.setMessage(
        'Please use the latest Chrome/Firefox browser versions to connect with your Ledger device',
      )
    }
  }
}
