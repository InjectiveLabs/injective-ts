import {
  chainErrorMessagesMap,
  chainModuleCodeErrorMessagesMap,
} from '../messages.js'
import {
  ErrorContext,
  ErrorContextCode,
  TransactionChainErrorModule,
  UnspecifiedErrorCode,
} from '../types/index.js'

export const parseErrorMessage = (message: string): string => {
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

export const mapFailedTransactionMessageFromString = (
  message: string,
): {
  message: string
  code: ErrorContextCode
  module?: TransactionChainErrorModule
} => {
  const parsedMessage = parseErrorMessage(message)
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
  const getWasmErrorFromMessage = (message: string) => {
    if (!message.includes('execute wasm contract failed')) {
      return
    }

    const ReasonPattern = /(.*?)execute wasm contract failed(.*?)/g
    const reason = ReasonPattern.exec(message)

    if (!reason) {
      return
    }

    if (reason.length < 2) {
      return
    }

    return reason[1].replace(
      'failed to execute message; message index: 0: ',
      '',
    )
  }

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

  const getReason = (message: string): string | undefined => {
    const ReasonPattern = /\[reason:"(.*?)"/g

    const codespace = ReasonPattern.exec(message)

    if (!codespace || codespace.length < 2) {
      if (message.includes('execute wasm contract failed')) {
        return getWasmErrorFromMessage(message)
      }

      return
    }

    const reason = codespace[1]

    if (reason === 'execute wasm contract failed') {
      const SubReasonPattern = /(.*?)Generic error:(.*?): execute wasm/g
      const subReason = SubReasonPattern.exec(message)

      if (!subReason) {
        return reason
      }

      return subReason[2] || reason
    }

    return reason
  }

  const ABCICode = context && context.code ? context.code : getABCICode(message)
  const contextModule = context?.contextModule || getContextModule(message)
  const reason = getReason(message)

  if (!ABCICode || !contextModule) {
    const failedTxMap = mapFailedTransactionMessageFromString(message)

    return {
      ...failedTxMap,
      contextModule: failedTxMap.module || contextModule,
      message: reason || failedTxMap.message,
    }
  }

  const codespaceErrorMessages = chainModuleCodeErrorMessagesMap[contextModule]

  if (!codespaceErrorMessages) {
    return {
      message: reason || message,
      code: ABCICode,
      contextModule,
    }
  }

  return {
    message: codespaceErrorMessages[ABCICode] || reason || message,
    code: ABCICode,
    contextModule,
  }
}

export const mapMetamaskMessage = (message: string): string => {
  const parsedMessage = message.trim().toLowerCase()

  if (parsedMessage.includes('User denied message signature'.toLowerCase())) {
    return 'The request has been rejected'
  }

  if (parsedMessage.toLowerCase().includes('user denied'.toLowerCase())) {
    return 'The request has been rejected'
  }

  if (parsedMessage.toLowerCase().includes('provided chain'.toLowerCase())) {
    return 'Your Metamask selected network is incorrect'
  }

  if (
    parsedMessage
      .toLowerCase()
      .includes('missing or invalid parameters'.toLowerCase())
  ) {
    return 'Please make sure you are using Metamask'
  }

  if (
    parsedMessage
      .toLowerCase()
      .includes('Keyring Controller signTypedMessage'.toLowerCase())
  ) {
    return 'Please ensure your Ledger is connected, unlocked and your Ethereum app is open.'
  }

  return message.replaceAll('Keyring Controller signTypedMessage:', '')
}
