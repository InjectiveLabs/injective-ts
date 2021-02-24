import { ContractEventLog } from '@injectivelabs/web3-contract-typings/types/types'
import { ContractException } from '@injectivelabs/exceptions'
import { AbiItem } from 'web3-utils'
import { ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { SubscriptionManager } from './SubscriptionManager'
import { EventFilters, InjectiveContracts } from './types'

export default class BaseContract<T, ContractEvents extends string> {
  private readonly subscriptionManager: SubscriptionManager<
    InjectiveContracts,
    ContractEvents
  >

  public readonly abi: AbiItem[]

  public readonly address: string

  protected readonly contract: T

  private readonly chainId: ChainId

  private readonly web3: Web3

  private readonly web3Ws: Web3

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
    this.web3Ws = web3Strategy.getWeb3WsForChainId(this.chainId)
    this.subscriptionManager = new SubscriptionManager({
      address: this.address,
      abi: this.abi,
      web3: this.web3Ws,
    })

    if (!this.web3 || !this.web3Ws) {
      throw new ContractException(
        `Web3Strategy was not initialized for ${this.chainId} chainId`,
      )
    }

    this.contract = (new this.web3.eth.Contract(abi, address) as unknown) as T
  }

  subscribe<V>(
    event: ContractEvents,
    filter: EventFilters,
    onEvent: (result: ContractEventLog<V>) => void,
  ): void {
    this.subscriptionManager.subscribe(event, filter, onEvent)
  }

  unsubscribe(subscriptionId: string): void {
    this.unsubscribe(subscriptionId)
  }

  unsubscribeAll(): void {
    this.unsubscribeAll()
  }
}
