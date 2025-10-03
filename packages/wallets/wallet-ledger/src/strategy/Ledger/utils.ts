import { hashTypedData, type TypedDataDefinition } from 'viem'

export const domainHash = (message: any) => {
  const typedData: TypedDataDefinition = {
    domain: message.domain,
    types: message.types,
    primaryType: 'EIP712Domain',
    message: message.domain,
  }
  return hashTypedData(typedData)
}

export const messageHash = (message: any) => {
  const typedData: TypedDataDefinition = {
    domain: message.domain,
    types: message.types,
    primaryType: message.primaryType,
    message: message.message,
  }
  return hashTypedData(typedData)
}
