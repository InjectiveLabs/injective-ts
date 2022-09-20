import { ConcreteException } from '../exception'
import { ChainCosmosErrorCode, ErrorContext, ErrorType } from '../types'

export class TransactionException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parseMessage(): void {
    const { message } = this
    const [, parsedMessage] = message.split('message index: 0:')
    const [actualMessage] = parsedMessage.split(': invalid request')
    const trimmedMessage = actualMessage.trim().trimEnd()

    if (trimmedMessage.toLowerCase().includes('insufficient fee')) {
      this.setMessage('You do not have enough funds to cover transaction fees.')
    }

    if (trimmedMessage.toLowerCase().includes('insufficient funds')) {
      this.setMessage('You do not have enough funds.')
    }
  }

  public parseCode(): void {
    const { message } = this

    if (message.toLowerCase().includes('insufficient fee')) {
      this.contextCode = ChainCosmosErrorCode.ErrInsufficientFee
    }

    if (message.toLowerCase().includes('insufficient funds')) {
      this.contextCode = ChainCosmosErrorCode.ErrInsufficientFunds
    }
  }
}
