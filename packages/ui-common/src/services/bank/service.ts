import { BankConsumer, GrpcCoin } from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { BankTransformer } from './transformer'
import { grpcCoinToUiCoin } from '../../utils'
import { BankBalances, UiSupplyCoin } from './types'
import { ChainMetrics, ServiceOptions } from '../../types'
import { INJ_DENOM } from '../../constants'
import { UiCoin } from '../../types/common'
import { BaseService } from '../BaseService'

export class BankService extends BaseService {
  protected consumer: BankConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new BankConsumer(this.endpoints.sentryGrpcApi)
  }

  async fetchBalance({
    injectiveAddress,
    denom,
  }: {
    injectiveAddress: string
    denom: string
  }) {
    const promise = this.consumer.fetchBalance({
      accountAddress: injectiveAddress,
      denom,
    })

    const balance = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchBalance,
    )

    return new BigNumberInWei(balance ? balance.getAmount() : 0)
  }

  async fetchBalances(injectiveAddress: string) {
    const promise = this.consumer.fetchBalances({
      accountAddress: injectiveAddress,
    })

    const balances = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchBalances,
    )

    const bankBalances = balances
      .filter((balance) => !balance.getDenom().startsWith('ibc'))
      .reduce(
        (balances: BankBalances, balance: GrpcCoin) => ({
          ...balances,
          [balance.getDenom()]: balance.getAmount(),
        }),
        {},
      )
    const ibcBankBalances = balances
      .filter((balance) => balance.getDenom().startsWith('ibc'))
      .reduce(
        (balances: BankBalances, balance: GrpcCoin) => ({
          ...balances,
          [balance.getDenom()]: balance.getAmount(),
        }),
        {},
      )

    return {
      bankBalances,
      ibcBankBalances,
    }
  }

  async fetchSupply(): Promise<{
    bankSupply: UiSupplyCoin[]
    ibcBankSupply: UiSupplyCoin[]
  }> {
    const promise = this.consumer.fetchSupply()
    const grpcSupply = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchSupply,
    )
    const supply = BankTransformer.grpcCoinsSupplyToUiCoins(grpcSupply)

    return {
      bankSupply: supply.filter((coin) => !coin.denom.startsWith('ibc')),
      ibcBankSupply: supply.filter((coin) => coin.denom.startsWith('ibc')),
    }
  }

  async fetchTotalInjSupply(): Promise<UiCoin> {
    const promise = this.consumer.fetchSupply()
    const supply = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchSupply,
    )

    return grpcCoinToUiCoin(
      supply.find((coin) => coin.getDenom() === INJ_DENOM)!,
    )
  }
}
