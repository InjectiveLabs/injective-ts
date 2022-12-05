import {
  getAddressFromInjectiveAddress,
  getInjectiveAddress,
  Msgs,
} from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_GAS_LIMIT,
} from '@injectivelabs/utils'

export const getGasPriceBasedOnMessage = (msgs: Msgs[]): number => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const messageType = messages[0].toDirectSign().type

  if (messageType.includes('MsgPrivilegedExecuteContract')) {
    return new BigNumberInBase(DEFAULT_GAS_LIMIT)
      .times(1.2)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('MsgExecuteContract')) {
    return new BigNumberInBase(DEFAULT_GAS_LIMIT)
      .times(2.5)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('exchange')) {
    return new BigNumberInBase(DEFAULT_EXCHANGE_LIMIT)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (
    messageType.includes('gov') &&
    (messageType.includes('MsgDeposit') ||
      messageType.includes('MsgSubmitProposal'))
  ) {
    return new BigNumberInBase(DEFAULT_GAS_LIMIT)
      .times(15)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  return new BigNumberInBase(DEFAULT_GAS_LIMIT)
    .times(messages.length)
    .toNumber()
}

export const getInjectiveSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('inj')) {
    return address
  }

  if (address.startsWith('0x')) {
    return getInjectiveAddress(address)
  }

  return ''
}

export const getEthereumSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('0x')) {
    return address
  }

  if (address.startsWith('inj')) {
    return getAddressFromInjectiveAddress(address)
  }

  return ''
}
