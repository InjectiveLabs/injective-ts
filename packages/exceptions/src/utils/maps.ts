import { chainModuleCodeErrorMessagesMap } from '../messages'
import { ErrorContext, ErrorContextCode, UnspecifiedErrorCode } from '../types'

export const mapFailedTransactionMessage = (
  message: string,
  context?: ErrorContext,
): { message: string; code: ErrorContextCode; contextModule?: string } => {
  const getABCICode = (message: string): number | undefined => {
    const chainCodePattern = /{key:"ABCICode" value:"(.*?)"}/g

    const chainCode = chainCodePattern.exec(message)

    if (!chainCode || chainCode.length < 2) {
      return
    }

    return Number(chainCode[1])
  }

  const getContextModule = (message: string): string | undefined => {
    const chainModulePattern = /{key:"Codespace" value:"(.*?)"}/g

    const chainCode = chainModulePattern.exec(message)

    if (!chainCode || chainCode.length < 2) {
      return
    }

    return chainCode[1]
  }

  const ABCICode = context && context.code ? context.code : getABCICode(message)
  const contextModule =
    context && context.contextModule
      ? context.contextModule
      : getContextModule(message)

  const defaultResponse = {
    message: 'Transaction execution has failed for unknown reason',
    code: UnspecifiedErrorCode,
    module: undefined,
  }

  if (
    !ABCICode ||
    !contextModule ||
    !chainModuleCodeErrorMessagesMap[contextModule]
  ) {
    return defaultResponse
  }

  const chainCodeErrorMessage =
    chainModuleCodeErrorMessagesMap[contextModule][ABCICode]

  if (!chainCodeErrorMessage) {
    return defaultResponse
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
