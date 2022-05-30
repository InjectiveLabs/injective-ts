import { GrpcCoin } from '@injectivelabs/sdk-ts'
import {
  ChainGrpcBankApi,
  ChainGrpcBankTransformer,
} from '@injectivelabs/sdk-ts/client'
import { BigNumberInWei } from '@injectivelabs/utils'
import { BankBalances, UiSupplyCoin } from '../types/bank'
import { ChainMetrics } from '../../../types/metrics'
import { INJ_DENOM } from '../../../constants'
import { UiCoin } from '../../../types/common'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types'

export class UiChainGrpcBankApi extends BaseApi {
  protected client: ChainGrpcBankApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ChainGrpcBankApi(options.endpoints.sentryGrpcApi)
  }

  async fetchBalance({
    injectiveAddress,
    denom,
  }: {
    injectiveAddress: string
    denom: string
  }) {
    const promise = this.client.fetchBalance({
      accountAddress: injectiveAddress,
      denom,
    })

    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchBalance,
    )
    const balance = response.getBalance()

    return new BigNumberInWei(balance ? balance.getAmount() : 0)
  }

  async fetchBalances(injectiveAddress: string) {
    const promise = this.client.fetchBalances(injectiveAddress)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchBalances,
    )
    const balances = response.getBalancesList()

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
    const promise = this.client.fetchTotalSupply()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchSupply,
    )
    const totalSupply = response.getSupplyList()
    const supply = ChainGrpcBankTransformer.grpcCoinsToCoins(totalSupply)

    return {
      bankSupply: supply.filter((coin) => !coin.denom.startsWith('ibc')),
      ibcBankSupply: supply.filter((coin) => coin.denom.startsWith('ibc')),
    }
  }

  async fetchTotalInjSupply(): Promise<UiCoin> {
    const promise = this.client.fetchTotalSupply()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchSupply,
    )
    const supply = response.getSupplyList()

    return ChainGrpcBankTransformer.grpcCoinToCoin(
      supply.find((coin) => coin.getDenom() === INJ_DENOM)!,
    )
  }
}
