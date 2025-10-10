import { hashDomain, hashStruct } from 'viem'

type TypeDefinition = Record<string, Array<{ name: string; type: string }>>

interface EIP712Message {
  types: TypeDefinition
  domain: Record<string, any>
  primaryType: string
  message: Record<string, any>
}

/**
 * Used mainly for Ledger Nano S
 */

export const domainHash = (message: EIP712Message): `0x${string}` => {
  return hashDomain({ domain: message.domain, types: message.types })
}

export const messageHash = (message: EIP712Message): `0x${string}` => {
  return hashStruct({
    data: message.message,
    types: message.types,
    primaryType: message.primaryType,
  })
}
