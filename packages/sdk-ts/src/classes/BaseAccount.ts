import { Address } from './Address'
import { AccountResponse } from '../client/chain'

export class BaseAccount extends Address {
  accountNumber: number

  sequence: number

  pubKey: {
    type: string
    key: string
  }

  constructor({
    address,
    accountNumber,
    sequence,
    pubKey,
  }: {
    address: string
    accountNumber: number
    sequence: number
    pubKey: {
      type: string
      key: string
    }
  }) {
    super(address)
    this.accountNumber = accountNumber
    this.sequence = sequence
    this.pubKey = pubKey
  }

  static fromRestApi(accountResponse: AccountResponse) {
    const { base_account: baseAccount } = accountResponse.account

    return new BaseAccount({
      address: baseAccount.address,
      accountNumber: parseInt(baseAccount.account_number, 10),
      sequence: parseInt(baseAccount.sequence, 10),
      pubKey: {
        type: baseAccount.pub_key['@type'],
        key: baseAccount.pub_key.key,
      },
    })
  }

  incrementSequence() {
    this.sequence += 1
  }
}
