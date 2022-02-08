import { BankConsumer, GrpcCoin } from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { BankTransformer } from './transformer'
import { grpcCoinToUiCoin } from '../utils'
import {
  BankBalances,
  BankBalanceWithTokenMetaData,
  IbcBankBalanceWithTokenMetaData,
  UiSupplyCoin,
  UiCoin,
} from './types'
import { IbcToken, Token } from '../token/types'
import { ChainMetrics, ServiceOptions } from '../types'
import { INJ_DENOM } from '../constants'
import { TokenService, TokenTransformer } from '../token'

export class BankService {
  private options: ServiceOptions

  private consumer: BankConsumer

  private tokenService: TokenService

  constructor({ options }: { options: ServiceOptions }) {
    this.options = options
    this.tokenService = new TokenService({ options })
    this.consumer = new BankConsumer(options.endpoints.sentryGrpcApi)
  }

  async fetchSupplyWithTokenMeta(supply: UiSupplyCoin[]): Promise<Token[]> {
    return supply
      .map(({ denom }: UiSupplyCoin) =>
        TokenTransformer.tokenMetaToToken(
          this.tokenService.getTokenMetaData(denom),
          denom,
        ),
      )
      .filter((token) => token) as Token[]
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

  async fetchBalancesWithTokenMetaData(
    balances: BankBalances,
    ibcBalances: BankBalances,
  ): Promise<{
    bankBalancesWithTokenMeta: BankBalanceWithTokenMetaData[]
    ibcBankBalancesWithTokenMeta: IbcBankBalanceWithTokenMetaData[]
  }> {
    const bankBalancesWithTokenMeta = Object.keys(balances)
      .map((denom) => ({
        denom,
        balance: balances[denom],
        token: TokenTransformer.tokenMetaToToken(
          this.tokenService.getTokenMetaData(denom),
          denom,
        ),
      }))
      .filter(
        (balance) => balance.token !== undefined,
      ) as BankBalanceWithTokenMetaData[]

    const ibcBankBalancesWithTokenMeta = (
      await Promise.all(
        Object.keys(ibcBalances).map(async (denom) => {
          const { baseDenom, path } = await this.tokenService.fetchDenomTrace(
            denom,
          )
          const tokenMeta =
            this.tokenService.getTokenMetaDataBySymbol(baseDenom)

          return {
            denom,
            baseDenom,
            balance: ibcBalances[denom],
            channelId: path.replace('transfer/', ''),
            token: TokenTransformer.tokenMetaToToken(tokenMeta, denom),
          }
        }),
      )
    ).filter(
      (balance) => balance.token !== undefined,
    ) as IbcBankBalanceWithTokenMetaData[]

    return {
      bankBalancesWithTokenMeta,
      ibcBankBalancesWithTokenMeta,
    }
  }

  async fetchIbcSupplyWithTokenMeta(
    supply: UiSupplyCoin[],
  ): Promise<IbcToken[]> {
    return (
      await Promise.all(
        supply.map(async ({ denom }: UiSupplyCoin) => {
          const { baseDenom, path } = await this.tokenService.fetchDenomTrace(
            denom,
          )
          const tokenMeta =
            this.tokenService.getTokenMetaDataBySymbol(baseDenom)

          return {
            baseDenom,
            channelId: path.replace('transfer/', ''),
            ...TokenTransformer.tokenMetaToToken(tokenMeta, denom),
          }
        }),
      )
    ).filter((token) => token) as IbcToken[]
  }

  async fetchSupply(): Promise<{
    bankSupply: UiSupplyCoin[]
    ibcBankSupply: UiSupplyCoin[]
  }> {
    const supply = BankTransformer.grpcCoinsSupplyToUiCoins(
      await this.consumer.fetchSupply(),
    )
    const supplyWithLabel = supply.map((coin) => {
      const tokenMeta = this.tokenService.getTokenMetaData(coin.denom)

      return {
        ...coin,
        label: tokenMeta ? tokenMeta.symbol : coin.denom,
      }
    })

    return {
      bankSupply: supplyWithLabel.filter(
        (coin) => !coin.denom.startsWith('ibc'),
      ),
      ibcBankSupply: supplyWithLabel.filter((coin) =>
        coin.denom.startsWith('ibc'),
      ),
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
