import * as InjectiveTypesV1Beta1AccountPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/account_pb.mjs'
import { uint8ArrayToBase64 } from '../../utils/encoding.js'

export const accountEthParser = <T>(
  ethAccount: any,
  pubKeyTypeUrl: string = '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
): T => {
  const account = InjectiveTypesV1Beta1AccountPb.EthAccount.fromBinary(
    ethAccount.value as Uint8Array,
  )
  const baseAccount = account.baseAccount!
  const pubKey = baseAccount.pubKey

  return {
    address: baseAccount.address,
    pubkey: pubKey
      ? {
          type: pubKeyTypeUrl,
          value: uint8ArrayToBase64(pubKey.value),
        }
      : null,
    accountNumber: parseInt(baseAccount.accountNumber.toString(), 10),
    sequence: parseInt(baseAccount.sequence.toString(), 10),
  } as T
}
