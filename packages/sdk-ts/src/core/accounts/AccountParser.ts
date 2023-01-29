import { Any } from 'cosmjs-types/google/protobuf/any'
import { Account } from '@cosmjs/stargate'
import { EthAccount } from '@injectivelabs/core-proto-ts/injective/types/v1beta1/account'

export const accountParser = (ethAccount: Any): Account => {
  const account = EthAccount.decode(ethAccount.value as Uint8Array)
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
    accountNumber: parseInt(baseAccount.accountNumber, 10),
    sequence: parseInt(baseAccount.sequence, 10),
  }
}
