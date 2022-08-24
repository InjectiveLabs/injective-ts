import { Address } from './Address'
import { AccountResponse } from '../client/chain'
import { AccountDetails } from '../types/auth'

/**
 * @category Utility Classes
 */
export class BaseAccount extends Address {
  public accountNumber: number

  public sequence: number

  public pubKey: {
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
      pubKey: baseAccount.pub_key
        ? {
            type: baseAccount.pub_key['@type'],
            key: baseAccount.pub_key.key,
          }
        : {
            type: '',
            key: '',
          },
    })
  }

  public incrementSequence() {
    this.sequence += 1
  }

  public toAccountDetails(): AccountDetails {
    return {
      address: this.bech32Address,
      pubKey: this.pubKey,
      accountNumber: this.accountNumber,
      sequence: this.sequence,
    }
  }
}
