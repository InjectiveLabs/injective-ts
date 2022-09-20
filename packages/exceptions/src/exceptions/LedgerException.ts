import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

const isCommonLockedError = (error: string) =>
  !!(
    error.includes('Ledger device: Incorrect length') ||
    error.includes('Ledger device: INS_NOT_SUPPORTED') ||
    error.includes('Ledger device: CLA_NOT_SUPPORTED') ||
    error.includes('Failed to open the device') ||
    error.includes('Failed to open the device') ||
    error.includes('Ledger Device is busy') ||
    error.includes('UNKNOWN_ERROR')
  )

export class LedgerException extends ConcreteException {
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
  }
}
