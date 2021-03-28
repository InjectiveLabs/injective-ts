import { ContractEventLog } from '@injectivelabs/web3-contract-typings/types/types'
import { ContractException } from '@injectivelabs/exceptions'
import { AbiItem } from 'web3-utils'
import { ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { BaseCurrency } from '@injectivelabs/web3-contract-typings/types/BaseCurrency'
import { DepositManager } from '@injectivelabs/web3-contract-typings/types/DepositManager'
import { Peggy } from '@injectivelabs/web3-contract-typings/types/Peggy'
import { EventFilters, InjectiveContracts } from './types'
import { SubscriptionManager } from './SubscriptionManager'

type ContractTypes = BaseCurrency | DepositManager | Peggy

export default class BaseContract<
  T extends ContractTypes,
  ContractEvents extends string
> {
  private subscriptionManager?: SubscriptionManager<
    InjectiveContracts,
    ContractEvents
  >

  private web3Ws?: Web3

  public readonly abi: AbiItem[]

  public readonly address: string

  protected readonly contract: T

  private readonly chainId: ChainId

  private readonly web3: Web3

  private readonly web3Strategy: Web3Strategy

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
    this.web3Strategy = web3Strategy
    this.web3 = web3Strategy.getWeb3ForChainId(this.chainId)

    if (!this.web3) {
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
    this.getSubscriptionManager().subscribe(event, filter, onEvent)
  }

  unsubscribe(subscriptionId: string): void {
    this.unsubscribe(subscriptionId)
  }

  unsubscribeAll(): void {
    this.unsubscribeAll()
  }

  private getSubscriptionManager(): SubscriptionManager<
    InjectiveContracts,
    ContractEvents
  > {
    if (this.subscriptionManager) {
      return this.subscriptionManager
    }

    this.web3Ws = this.web3Strategy.getWeb3WsForChainId(this.chainId)

    if (!this.web3Ws) {
      throw new ContractException(
        `Subscription Manager cannot be initialized, Web3Ws doesn't exist for ${this.chainId} chainId`,
      )
    }

    this.subscriptionManager = new SubscriptionManager({
      address: this.address,
      abi: this.abi,
      web3: this.web3Ws,
    })

    return this.subscriptionManager
  }
}
