import { ConcreteException } from '../exception'
import {
  ChainCosmosErrorCode,
  ErrorContext,
  ErrorContextCode,
  ErrorType,
  UnspecifiedErrorCode,
} from '../types'

export const mapMessage = (
  message: string,
): { message: string; code: ErrorContextCode } => {
  const [, parsedMessage] = message.split('message index: 0:')
  const [actualMessage] = parsedMessage.split(': invalid request')
  const trimmedMessage = actualMessage.trim().trimEnd()

  if (trimmedMessage.toLowerCase().includes('insufficient fee')) {
    return {
      message: 'You do not have enough funds to cover transaction fees.',
      code: ChainCosmosErrorCode.ErrInsufficientFee,
    }
  }

  if (trimmedMessage.toLowerCase().includes('insufficient funds')) {
    return {
      message: 'You do not have enough funds to cover transaction fees.',
      code: ChainCosmosErrorCode.ErrInsufficientFunds,
    }
  }

  return { message: trimmedMessage, code: UnspecifiedErrorCode }
}

export class TransactionException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.ChainError
  }

  public parse(): void {
    const { message } = this
    const { message: parsedMessage, code } = mapMessage(message)

    this.setMessage(parsedMessage)
    this.setContextCode(code)
  }
}
