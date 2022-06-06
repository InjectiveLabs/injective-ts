import { AbiItem } from 'web3-utils'
import { EthereumChainId } from '@injectivelabs/ts-types'
import type Web3 from 'web3'

export default class BaseContract<T extends any> {
  public readonly abi: AbiItem[]

  public readonly address: string

  protected readonly contract: T

  private readonly web3: Web3

  constructor({
    abi,
    address,
    web3,
  }: {
    abi: AbiItem[]
    ethereumChainId?: EthereumChainId
    address: string
    web3: Web3
  }) {
    this.abi = abi
    this.address = address
    this.web3 = web3
    this.contract = new this.web3.eth.Contract(abi, address) as unknown as T
  }
}
