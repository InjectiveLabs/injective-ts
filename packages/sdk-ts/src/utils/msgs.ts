import {
  toBigNumber,
  DEFAULT_GAS_LIMIT,
  DEFAULT_IBC_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
} from '@injectivelabs/utils'
import type { Msgs } from '../core/modules/msgs.js'

export const getGasPriceBasedOnMessage = (msgs: Msgs[]): number => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const messageType = messages[0].toDirectSign().type

  if (messageType.includes('MsgPrivilegedExecuteContract')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(6)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('MsgExecuteContract')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(3)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('exchange')) {
    return toBigNumber(DEFAULT_EXCHANGE_LIMIT)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('wasm')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(1.5)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('authz')) {
    return toBigNumber(DEFAULT_EXCHANGE_LIMIT)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (
    messageType.includes('gov') &&
    (messageType.includes('MsgDeposit') ||
      messageType.includes('MsgSubmitProposal'))
  ) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(15)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('MsgTransfer')) {
    return toBigNumber(DEFAULT_IBC_GAS_LIMIT).times(messages.length).toNumber()
  }

  return toBigNumber(DEFAULT_GAS_LIMIT).times(messages.length).toNumber()
}
