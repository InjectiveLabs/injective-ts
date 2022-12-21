import { Any } from 'cosmjs-types/google/protobuf/any'
import { Account } from '@cosmjs/stargate'
import { EthAccount } from '@injectivelabs/chain-api/injective/types/v1beta1/account_pb'

export const accountParser = (ethAccount: Any): Account => {
  const account = EthAccount.deserializeBinary(ethAccount.value as Uint8Array)
  const baseAccount = account.getBaseAccount()!
  const pubKey = baseAccount.getPubKey()

  return {
    address: baseAccount.getAddress(),
    pubkey: pubKey
      ? {
          type: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
          value: pubKey.getValue_asB64(),
        }
      : null,
    accountNumber: baseAccount.getAccountNumber(),
    sequence: baseAccount.getSequence(),
  }
}
