import {
  ChainCosmosErrorCode,
  ErrorContextCode,
  UnspecifiedErrorCode,
} from '../types'

export const parseMessage = (message: string) => {
  const firstParse = message.split('message index: 0:')

  if (firstParse.length === 1) {
    const [firstParseString] = firstParse
    const secondParse = firstParseString.split(': invalid request')
    const [secondParseString] = secondParse

    return secondParseString.trim().trimEnd()
  }

  const [, firstParseString] = firstParse
  const [actualMessage] = firstParseString.split(': invalid request')

  return actualMessage.trim().trimEnd()
}

export const mapFailedTransactionMessage = (
  message: string,
): { message: string; code: ErrorContextCode } => {
  const parsedMessage = parseMessage(message)

  if (parsedMessage.toLowerCase().includes('insufficient fee')) {
    return {
      message: 'You do not have enough funds to cover transaction fees.',
      code: ChainCosmosErrorCode.ErrInsufficientFee,
    }
  }

  if (parsedMessage.toLowerCase().includes('insufficient funds')) {
    return {
      message: 'You do not have enough funds to cover transaction fees.',
      code: ChainCosmosErrorCode.ErrInsufficientFunds,
    }
  }

  if (parsedMessage.toLowerCase().includes('tx timeout height')) {
    return {
      message: 'The transaction failed to be included within a block on time.',
      code: ChainCosmosErrorCode.ErrTxTimeoutHeight,
    }
  }

  return { message: parsedMessage, code: UnspecifiedErrorCode }
}
