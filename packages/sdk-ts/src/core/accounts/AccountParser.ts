import * as InjectiveTypesV1Beta1AccountPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/account_pb.mjs'
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
          value: Buffer.from(pubKey.value).toString('base64'),
        }
      : null,
    accountNumber: parseInt(baseAccount.accountNumber.toString(), 10),
    sequence: parseInt(baseAccount.sequence.toString(), 10),
  }
}
