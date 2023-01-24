import { chainErrorMessagesMap, chainCodeErrorMessagesMap } from '../messages'
import {
  ErrorContextCode,
  UnspecifiedErrorCode,
  ChainCosmosErrorCode,
} from '../types'

/* todo: remove this with the next chain upgrade */
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

/* todo: remove this with the next chain upgrade */
const mapMessageByContent = (
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

const getABCICode = (message: string): number | undefined => {
  const chainCodePattern = /{key:"ABCICode" (.*?)}/g
  const numericPattern = /\d+/g

  const chainCodeMsg = message.match(chainCodePattern)

  if (!chainCodeMsg || chainCodeMsg.length === 0) {
    return
  }

  const chainCode = chainCodeMsg[0].match(numericPattern)

  if (!chainCode || chainCode.length === 0) {
    return
  }

  return Number(chainCode[0])
}

export const mapFailedTransactionMessage = (
  message: string,
): { message: string; code: ErrorContextCode } => {
  // console.log({ errorContnxtCode: code })

  console.log(message)

  const ABCICode = getABCICode(message)

  if (!ABCICode) {
    return mapMessageByContent(message)
  }

  const chainCodeErrorMessage = chainCodeErrorMessagesMap[ABCICode]

  if (!chainCodeErrorMessage) {
    return {
      message:
        chainCodeErrorMessagesMap[ChainCosmosErrorCode.ErrUnknownRequest],
      code: ChainCosmosErrorCode.ErrUnknownRequest,
    }
  }

  return {
    message: chainCodeErrorMessage,
    code: ABCICode,
  }
}

export const mapMetamaskMessage = (message: string): string => {
  const parsedMessage = message.trim().toLowerCase()

  if (parsedMessage.includes('User denied message signature'.toLowerCase())) {
    return 'The request has been rejected'
  }

  return parsedMessage
}
