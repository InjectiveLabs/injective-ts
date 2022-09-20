import { messagesMap } from '../messages'
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
    Object.keys(messagesMap) as Array<keyof typeof messagesMap>
  ).find((key) => key.toLowerCase() === parsedMessage.toLowerCase())

  if (!messageInMapKey) {
    return { message: parsedMessage, code: UnspecifiedErrorCode }
  }

  return messagesMap[messageInMapKey]
}
