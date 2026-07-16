import * as InjectiveTypesV1Beta1AccountPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/account_pb'
import { uint8ArrayToBase64 } from '../../utils/encoding.js'
import type { Account } from '@cosmjs/stargate'

export const accountParser = (ethAccount: any): Account => {
  const account = InjectiveTypesV1Beta1AccountPb.EthAccount.fromBinary(
    ethAccount.value as Uint8Array,
  )
  const baseAccount = account.baseAccount!
  const pubKey = baseAccount.pubKey

  return {
    address: baseAccount.address,
    pubkey: pubKey
      ? {
          type: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
          value: uint8ArrayToBase64(pubKey.value),
        }
      : null,
    accountNumber: baseAccount.accountNumber,
    sequence: parseInt(baseAccount.sequence.toString(), 10),
  }
}
