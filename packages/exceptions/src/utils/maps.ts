import { chainErrorMessagesMap } from '../messages'
import { ErrorContextCode, UnspecifiedErrorCode } from '../types'

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
  const messageInMapKey = (
    Object.keys(chainErrorMessagesMap) as Array<
      keyof typeof chainErrorMessagesMap
    >
  ).find((key) => parsedMessage.toLowerCase().includes(key.toLowerCase()))

  if (!messageInMapKey) {
    return { message: parsedMessage, code: UnspecifiedErrorCode }
  }

  return chainErrorMessagesMap[messageInMapKey]
}

export const mapMetamaskMessage = (message: string): string => {
  const parsedMessage = message.trim().toLowerCase()

  if (parsedMessage.includes('User denied message signature'.toLowerCase())) {
    return 'You have rejected signing the transaction'
  }

  return parsedMessage
}
