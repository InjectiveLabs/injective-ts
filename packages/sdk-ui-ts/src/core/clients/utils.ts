import { Msgs } from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_GAS_LIMIT,
} from '@injectivelabs/utils'

export const getGasPriceBasedOnMessage = (msgs: Msgs[]): number => {
  const hasMultipleMessages = Array.isArray(msgs)
  const isMsgExecMessage = (message: Msgs) =>
    message.toWeb3()['@type'].includes('MsgExec')
  const isExchangeMessage = (message: Msgs) =>
    message.toWeb3()['@type'].startsWith('/injective')

  const hasMsgExecMessages = Array.isArray(msgs)
    ? msgs.some(isMsgExecMessage)
    : isMsgExecMessage(msgs)

  if (hasMsgExecMessages) {
    return DEFAULT_GAS_LIMIT * 1.2
  }

  const hasExchangeMessages = Array.isArray(msgs)
    ? msgs.some(isExchangeMessage)
    : isExchangeMessage(msgs)

  return new BigNumberInBase(
    hasExchangeMessages ? DEFAULT_EXCHANGE_LIMIT : DEFAULT_GAS_LIMIT,
  )
    .times(hasMultipleMessages ? msgs.length : 1)
    .toNumber()
}
