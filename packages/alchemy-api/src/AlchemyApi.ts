import { createAlchemyWeb3, AlchemyWeb3 } from '@alch/alchemy-web3'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'

export default class AlchemyApi {
  web3: AlchemyWeb3

  constructor(endpoint: string) {
    this.web3 = createAlchemyWeb3(endpoint)
  }

  fetchTokenAllowance({
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
      return web3.alchemy.getTokenAllowance({ owner, spender, contract })
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  fetchTokenBalances({
    address,
    contractAddresses,
  }: {
    address: AccountAddress
    contractAddresses: string[]
  }) {
    const { web3 } = this

    try {
      return web3.alchemy.getTokenBalances(address, contractAddresses)
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  fetchTokenMetadata(contractAddress: string) {
    const { web3 } = this

    try {
      return web3.alchemy.getTokenMetadata(contractAddress)
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  fetchLatestBlock() {
    const { web3 } = this

    try {
      return web3.eth.getBlock('latest').then((block) => block)
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }
}
