import { ContractEventLog } from '@injectivelabs/web3-contract-typings/types/types'
import { ContractException } from '@injectivelabs/exceptions'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Subscription } from 'web3-core-subscriptions'
import { EventFilters, InjectiveContracts } from './types'

export class SubscriptionManager<
  T extends InjectiveContracts,
  ContractEvents extends string
> {
  private readonly web3: Web3

  private contract: T

  public readonly address: string

  public readonly abi: AbiItem[]

  private subscriptions: Subscription<unknown>[] = []

  constructor({
    address,
    abi,
    web3,
  }: {
    address: string
    abi: AbiItem[]
    web3: Web3
  }) {
    this.address = address
    this.abi = abi
    this.web3 = web3
    this.contract = (new this.web3.eth.Contract(
      this.abi,
      this.address,
    ) as unknown) as T
  }

  subscribe<V>(
    event: ContractEvents,
    filter: EventFilters,
    onEvent: (result: ContractEventLog<V>) => void,
  ): void {
    // @ts-expect-error cannot be used to index type
    const subscription = this.contract.events[event](
      { filter },
      (error: Error, result: ContractEventLog<V>) => {
        if (error) {
          throw new ContractException(error.message)
        }

        onEvent(result)
      },
    ) as Subscription<V>

    this.subscriptions.push(subscription)
  }

  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.find(
      (subscription: Subscription<unknown>) =>
        subscription.id === subscriptionId,
    )

    if (subscription) {
      subscription.unsubscribe()
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription: Subscription<unknown>) => {
      subscription.unsubscribe()
    })

    this.subscriptions = []
  }
}
