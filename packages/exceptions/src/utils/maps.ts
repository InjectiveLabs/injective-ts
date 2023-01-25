import { chainModuleCodeErrorMessagesMap } from '../messages'
import { ErrorContextCode, UnspecifiedErrorCode } from '../types'

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

export const mapFailedTransactionMessage = (
  message: string,
): { message: string; code: ErrorContextCode; module?: string } => {
  const ABCICode = getABCICode(message)
  const module = getContextModule(message)

  const defaultResponse = {
    message: 'The request is not known',
    code: UnspecifiedErrorCode,
    module: undefined,
  }

  if (!ABCICode || !module || !chainModuleCodeErrorMessagesMap[module]) {
    return defaultResponse
  }

  const chainCodeErrorMessage =
    chainModuleCodeErrorMessagesMap[module][ABCICode]

  if (!chainCodeErrorMessage) {
    return defaultResponse
  }

  return {
    message: chainCodeErrorMessage,
    code: ABCICode,
    module,
  }
}

export const mapMetamaskMessage = (message: string): string => {
  const parsedMessage = message.trim().toLowerCase()

  if (parsedMessage.includes('User denied message signature'.toLowerCase())) {
    return 'The request has been rejected'
  }

  return parsedMessage
}
