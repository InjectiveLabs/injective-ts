import {
  Erc20TokenMetaFactory,
  Erc20TokenMeta,
  TokenMeta,
} from '@injectivelabs/token-metadata'
import { IBCConsumer } from '@injectivelabs/chain-consumer'
import {
  UiBaseDerivativeMarket,
  UiBaseDerivativeMarketWithTokenMeta,
} from '../derivative/types'
import { UiBaseSpotMarket, UiBaseSpotMarketWithTokenMeta } from '../spot/types'
import { INJ_DENOM } from '../constants'
import { ServiceOptions, ChainMetrics } from '../types'
import { TokenTransformer } from './transformer'
import { BankBalances, UiSupplyCoin } from '../bank/types'
import {
  BankBalanceWithTokenMetaData,
  IbcBankBalanceWithTokenMetaData,
  IbcToken,
  Token,
  UiSupplyCoinForSelect,
  SubaccountBalanceWithTokenMetaData,
} from './types'
import { UiSubaccountBalance } from '../subaccount/types'
import { BaseService } from '../BaseService'

export class TokenService extends BaseService {
  protected ibcConsumer: IBCConsumer

  protected erc20TokenMeta: Erc20TokenMeta

  constructor(options: ServiceOptions) {
    super(options)
    this.ibcConsumer = new IBCConsumer(options.endpoints.sentryGrpcApi)
    this.erc20TokenMeta = Erc20TokenMetaFactory.make(options.network)
  }

  async fetchDenomTrace(denom: string) {
    const hash = denom.replace('ibc/', '')
    const promise = this.ibcConsumer.fetchDenomTrace(hash)
    const denomTrace = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchDenomTrace,
    )

    if (!denomTrace) {
      throw new Error(`Denom trace not found for ${denom}`)
    }

    return {
      path: denomTrace.getPath(),
      baseDenom: denomTrace.getBaseDenom(),
    }
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  getCoinGeckoId(symbol: string): string {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getCoinGeckoIdFromSymbol(symbol)
  }

  getTokenMetaData(denom: string): TokenMeta | undefined {
    const { erc20TokenMeta } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return erc20TokenMeta.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return erc20TokenMeta.getMetaByAddress(address)
  }

  async getIbcTokenMetaData(denom: string): Promise<TokenMeta | undefined> {
    const { erc20TokenMeta } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace(denom)

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  async getTokenMetaDataWithIbc(denom: string): Promise<TokenMeta | undefined> {
    return denom.startsWith('ibc/')
      ? this.getIbcTokenMetaData(denom)
      : this.getTokenMetaData(denom)
  }

  async getSupplyWithTokenMeta(supply: UiSupplyCoin[]): Promise<Token[]> {
    return supply
      .map(({ denom }: UiSupplyCoin) => {
        const tokenMeta = this.getTokenMetaData(denom)

        return TokenTransformer.tokenMetaToToken(tokenMeta, denom)
      })
      .filter((token) => token) as Token[]
  }

  async getBalancesWithTokenMetaData(
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
          this.getTokenMetaData(denom),
          denom,
        ),
      }))
      .filter(
        (balance) => balance.token !== undefined,
      ) as BankBalanceWithTokenMetaData[]

    const ibcBankBalancesWithTokenMeta = (
      await Promise.all(
        Object.keys(ibcBalances).map(async (denom) => {
          const { baseDenom, path } = await this.fetchDenomTrace(denom)
          const tokenMeta = this.getTokenMetaDataBySymbol(baseDenom)

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

  async getIbcSupplyWithTokenMeta(supply: UiSupplyCoin[]): Promise<IbcToken[]> {
    return (
      await Promise.all(
        supply.map(async ({ denom }: UiSupplyCoin) => {
          const { baseDenom, path } = await this.fetchDenomTrace(denom)
          const tokenMeta = this.getTokenMetaDataBySymbol(baseDenom)

          return {
            baseDenom,
            channelId: path.replace('transfer/', ''),
            ...TokenTransformer.tokenMetaToToken(tokenMeta, denom),
          }
        }),
      )
    ).filter((token) => token) as IbcToken[]
  }

  async getSupplyWithLabel({
    bankSupply,
    ibcBankSupply,
  }: {
    bankSupply: UiSupplyCoin[]
    ibcBankSupply: UiSupplyCoin[]
  }): Promise<{
    bankSupply: UiSupplyCoinForSelect[]
    ibcBankSupply: UiSupplyCoinForSelect[]
  }> {
    const appendLabel = (coin: UiSupplyCoin): UiSupplyCoinForSelect => {
      const tokenMeta = this.getTokenMetaData(coin.denom)

      return {
        ...coin,
        code: coin.denom,
        label: tokenMeta ? tokenMeta.symbol : coin.denom,
      }
    }

    const bankSupplyWithLabel = bankSupply.map(appendLabel)
    const ibcBankSupplyWithLabel = ibcBankSupply.map(appendLabel)

    return {
      bankSupply: bankSupplyWithLabel,
      ibcBankSupply: ibcBankSupplyWithLabel,
    }
  }

  async getSubaccountBalancesWithTokenMeta(
    balances: UiSubaccountBalance[],
  ): Promise<SubaccountBalanceWithTokenMetaData[]> {
    return (await Promise.all(
      balances.map(async (balance) => ({
        denom: balance.denom,
        availableBalance: balance.availableBalance,
        totalBalance: balance.totalBalance,
        token: TokenTransformer.tokenMetaToToken(
          await this.getTokenMetaDataWithIbc(balance.denom),
          balance.denom,
        ),
      })),
    ).then((balances) =>
      balances.filter((balance) => balance.token !== undefined),
    )) as SubaccountBalanceWithTokenMetaData[]
  }

  async getSpotMarketsWithTokenMeta(
    markets: UiBaseSpotMarket[],
  ): Promise<UiBaseSpotMarketWithTokenMeta[]> {
    return (
      await Promise.all(
        markets.map(async (market) => {
          const slug = market.ticker
            .replace('/', '-')
            .replace(' ', '-')
            .toLowerCase()
          const baseToken = TokenTransformer.tokenMetaToToken(
            await this.getTokenMetaDataWithIbc(market.baseDenom),
            market.baseDenom,
          )
          const quoteToken = TokenTransformer.tokenMetaToToken(
            await this.getTokenMetaDataWithIbc(market.quoteDenom),
            market.quoteDenom,
          )

          if (baseToken && !baseToken.coinGeckoId) {
            baseToken.coinGeckoId = this.getCoinGeckoId(baseToken.symbol)
          }

          if (quoteToken && !quoteToken.coinGeckoId) {
            quoteToken.coinGeckoId = this.getCoinGeckoId(quoteToken.symbol)
          }

          return {
            ...market,
            slug,
            baseToken,
            quoteToken,
          }
        }),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseSpotMarketWithTokenMeta[]
  }

  async getDerivativeMarketsWithTokenMeta(
    markets: UiBaseDerivativeMarket[],
  ): Promise<UiBaseDerivativeMarketWithTokenMeta[]> {
    return (
      await Promise.all(
        markets.map(async (market) => {
          const slug = market.ticker
            .replace('/', '-')
            .replaceAll(' ', '-')
            .toLowerCase()
          const [baseTokenSymbol] = slug.split('-')
          const baseToken = TokenTransformer.tokenMetaToToken(
            this.getTokenMetaDataBySymbol(baseTokenSymbol),
            baseTokenSymbol,
          )
          const quoteToken = TokenTransformer.tokenMetaToToken(
            await this.getTokenMetaDataWithIbc(market.quoteDenom),
            market.quoteDenom,
          )

          if (quoteToken && !quoteToken.coinGeckoId) {
            quoteToken.coinGeckoId = this.getCoinGeckoId(quoteToken.symbol)
          }

          return {
            ...market,
            slug,
            baseToken,
            quoteToken,
          }
        }),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseDerivativeMarketWithTokenMeta[]
  }
}
