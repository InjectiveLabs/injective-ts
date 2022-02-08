import { ContractException } from '@injectivelabs/exceptions'
import { AbiItem } from 'web3-utils'
import { ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { BaseCurrency } from '@injectivelabs/web3-contract-typings/types/BaseCurrency'
import { DepositManager } from '@injectivelabs/web3-contract-typings/types/DepositManager'
import { Peggy } from '@injectivelabs/web3-contract-typings/types/Peggy'

type ContractTypes = BaseCurrency | DepositManager | Peggy

export default class BaseContract<T extends ContractTypes> {
  public readonly abi: AbiItem[]

  public readonly address: string

  protected readonly contract: T

  private readonly chainId: ChainId

  private readonly web3: Web3

  constructor({
    abi,
    chainId,
    address,
    web3Strategy,
  }: {
    abi: AbiItem[]
    chainId: ChainId
    address: string
    web3Strategy: Web3Strategy
  }) {
    this.abi = abi
    this.chainId = chainId
    this.address = address
    this.web3 = web3Strategy.getWeb3ForChainId(this.chainId)

    if (!this.web3) {
      throw new ContractException(
        `Web3Strategy was not initialized for ${this.chainId} chainId`,
      )
    }

    this.contract = new this.web3.eth.Contract(abi, address) as unknown as T
  }
}
