import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { getEthereumAddress, getInjectiveAddress } from '../../../../utils'
import { MessageGenerated } from '../types'

export const createAnyMessage = (msg: MessageGenerated) => {
  const message = new Any()
  message.setTypeUrl(`${msg.type.startsWith('/') ? '' : '/'}${msg.type}`)
  message.setValue(msg.value.serializeBinary())

  return message
}

export const createAny = (value: any, type: string) => {
  const message = new Any()
  message.setTypeUrl(type)
  message.setValue(value)

  return message
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
    return getEthereumAddress(address)
  }

  return ''
}
