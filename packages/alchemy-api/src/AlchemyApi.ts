import { createAlchemyWeb3, AlchemyWeb3 } from '@alch/alchemy-web3'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'

export default class AlchemyApi {
  web3: AlchemyWeb3

  constructor(endpoint: string) {
    this.web3 = createAlchemyWeb3(endpoint)
  }

  getTokenAllowance({
    owner,
    spender,
    contract,
  }: {
    owner: AccountAddress
    spender: AccountAddress
    contract: string
  }) {
    const { web3 } = this

    try {
      web3.alchemy.getTokenAllowance({ owner, spender, contract })
    } catch (e) {
      throw new Web3Exception(e.message)
    }
  }

  getTokenBalances({
    address,
    contractAddresses,
  }: {
    address: AccountAddress
    contractAddresses: string[]
  }) {
    const { web3 } = this

    try {
      web3.alchemy.getTokenBalances(address, contractAddresses)
    } catch (e) {
      throw new Web3Exception(e.message)
    }
  }

  getTokenMetadata(contractAddress: string) {
    const { web3 } = this

    try {
      web3.alchemy.getTokenMetadata(contractAddress)
    } catch (e) {
      throw new Web3Exception(e.message)
    }
  }
}
