import {
  chainErrorMessagesMap,
  chainModuleCodeErrorMessagesMap,
} from '../messages'
import {
  ErrorContext,
  ErrorContextCode,
  TransactionChainErrorModule,
  UnspecifiedErrorCode,
} from '../types'

export const mapFailedTransactionMessageFromString = (
  message: string,
): {
  message: string
  code: ErrorContextCode
  module?: TransactionChainErrorModule
} => {
  const parseMessage = (message: string) => {
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

  const parsedMessage = parseMessage(message)
  const messageInMapKey = (
    Object.keys(chainErrorMessagesMap) as Array<
      keyof typeof chainErrorMessagesMap
    >
  ).find((key) => parsedMessage.toLowerCase().includes(key.toLowerCase()))

  if (!messageInMapKey) {
    return {
      message: parsedMessage,
      code: UnspecifiedErrorCode,
      module: undefined,
    }
  }

  return chainErrorMessagesMap[messageInMapKey]
}

export const mapFailedTransactionMessage = (
  message: string,
  context?: ErrorContext,
): { message: string; code: ErrorContextCode; contextModule?: string } => {
  const getABCICode = (message: string): number | undefined => {
    const ABCICodePattern = /{key:"ABCICode"[ \t]+value:"(.*?)"}/g

    const ABCICode = ABCICodePattern.exec(message)

    if (!ABCICode || ABCICode.length < 2) {
      return
    }

    return Number(ABCICode[1])
  }

  const getContextModule = (message: string): string | undefined => {
    const codespacePattern = /{key:"Codespace"[ \t]+value:"(.*?)"}/g

    const codespace = codespacePattern.exec(message)

    if (!codespace || codespace.length < 2) {
      return
    }

    return codespace[1]
  }

  const ABCICode = context && context.code ? context.code : getABCICode(message)
  const contextModule =
    context && context.contextModule
      ? context.contextModule
      : getContextModule(message)

  if (
    !ABCICode ||
    !contextModule ||
    !chainModuleCodeErrorMessagesMap[contextModule]
  ) {
    return mapFailedTransactionMessageFromString(message)
  }

  const chainCodeErrorMessage =
    chainModuleCodeErrorMessagesMap[contextModule][ABCICode]

  if (!chainCodeErrorMessage) {
    return mapFailedTransactionMessageFromString(message)
  }

  return {
    message: chainCodeErrorMessage,
    code: ABCICode,
    contextModule,
  }
}

export const mapMetamaskMessage = (message: string): string => {
  const parsedMessage = message.trim().toLowerCase()

  if (parsedMessage.includes('User denied message signature'.toLowerCase())) {
    return 'The request has been rejected'
  }

  return parsedMessage
}
