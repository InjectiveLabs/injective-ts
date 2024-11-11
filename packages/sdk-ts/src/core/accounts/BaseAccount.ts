import { Address } from './Address.js'
import { AccountResponse, BaseAccountRestResponse } from '../../client/chain/index.js'
import { AccountDetails } from '../../types/auth.js'

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
      accountNumber: baseAccount.account_number
        ? parseInt(baseAccount.account_number, 10)
        : 0,
      sequence: baseAccount.sequence ? parseInt(baseAccount.sequence, 10) : 0,
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

  static fromRestCosmosApi(accountResponse: BaseAccountRestResponse) {
    return new BaseAccount({
      address: accountResponse.address,
      accountNumber: accountResponse.account_number
        ? parseInt(accountResponse.account_number, 10)
        : 0,
      sequence: accountResponse.sequence
        ? parseInt(accountResponse.sequence, 10)
        : 0,
      pubKey: accountResponse.pub_key
        ? {
            type: accountResponse.pub_key['@type'],
            key: accountResponse.pub_key.key,
          }
        : {
            type: '',
            key: '',
          },
    })
  }

  public incrementSequence() {
    this.sequence += 1

    return this
  }

  public toAccountDetails(): AccountDetails {
    return {
      pubKey: this.pubKey,
      sequence: this.sequence,
      address: this.bech32Address,
      accountNumber: this.accountNumber,
    }
  }
}
