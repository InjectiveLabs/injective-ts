import { BankConsumer, GrpcCoin } from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { BankTransformer } from './transformer'
import { grpcCoinToUiCoin } from '../utils'
import { BankBalances, UiSupplyCoin } from './types'
import { ChainMetrics, ServiceOptions } from '../types'
import { INJ_DENOM } from '../constants'
import { UiCoin } from '../types/common'

export class BankService {
  private options: ServiceOptions

  private consumer: BankConsumer

  constructor({ options }: { options: ServiceOptions }) {
    this.options = options
    this.consumer = new BankConsumer(options.endpoints.sentryGrpcApi)
  }

  async fetchBalances(injectiveAddress: string) {
    const promise = this.consumer.fetchBalances({
      accountAddress: injectiveAddress,
    })

    const balances = await this.options.metricsProvider.sendAndRecord(
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

    const balance = await this.options.metricsProvider.sendAndRecord(
      promise,
      ChainMetrics.FetchBalances,
    )

    return new BigNumberInWei(balance ? balance.getAmount() : 0)
  }

  async fetchSupply(): Promise<{
    bankSupply: UiSupplyCoin[]
    ibcBankSupply: UiSupplyCoin[]
  }> {
    const supply = BankTransformer.grpcCoinsSupplyToUiCoins(
      await this.consumer.fetchSupply(),
    )

    return {
      bankSupply: supply.filter((coin) => !coin.denom.startsWith('ibc')),
      ibcBankSupply: supply.filter((coin) => coin.denom.startsWith('ibc')),
    }
  }

  async fetchTotalInjSupply(): Promise<UiCoin> {
    const supply = await this.consumer.fetchSupply()
    const injSupply = supply.find((coin) => coin.getDenom() === INJ_DENOM)

    if (!injSupply) {
      return {
        denom: INJ_DENOM,
        amount: '0',
      }
    }

    return grpcCoinToUiCoin(injSupply)
  }
}
