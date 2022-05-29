import {
  Erc20TokenMetaFactory,
  Erc20TokenMeta,
  TokenMeta,
  ibcTokens,
} from '@injectivelabs/token-metadata'
import { IBCConsumer } from '@injectivelabs/chain-consumer'
import {
  UiBaseDerivativeMarket,
  UiBaseDerivativeMarketWithToken,
} from '../derivative/types'
import { UiBaseSpotMarket, UiBaseSpotMarketWithToken } from '../spot/types'
import { INJ_DENOM } from '../../constants'
import {
  ServiceOptions,
  ChainMetrics,
  UiSupplyCoinForSelect,
} from '../../types'
import { TokenTransformer } from './transformer'
import { BankBalances, UiSupplyCoin } from '../bank/types'
import {
  BankBalanceWithToken,
  IbcBankBalanceWithToken,
  IbcToken,
  Token,
  SubaccountBalanceWithToken,
  UiBridgeTransactionWithToken,
  DenomTrace,
} from './types'
import { UiSubaccountBalance } from '../subaccount/types'
import { BaseService } from '../BaseService'
import { UiBridgeTransaction } from '../bridge/types'

export class TokenService extends BaseService {
  protected ibcConsumer: IBCConsumer

  protected erc20TokenMeta: Erc20TokenMeta

  protected cachedDenomTraces: Record<string, DenomTrace> = {}

  constructor(options: ServiceOptions) {
    super(options)
    this.ibcConsumer = new IBCConsumer(this.endpoints.sentryGrpcApi)
    this.erc20TokenMeta = Erc20TokenMetaFactory.make(this.options.network)
    this.cachedDenomTraces = Object.keys(ibcTokens).reduce(
      (cachedDenomTraces, ibcTokenKey) => ({
        ...cachedDenomTraces,
        [ibcTokenKey.toString()]: ibcTokens[
          ibcTokenKey as unknown as string as keyof typeof ibcTokens
        ] as DenomTrace,
      }),
      {},
    )
  }

  async fetchDenomTraces() {
    const promise = this.ibcConsumer.fetchDenomsTrace()
    const denomTraces = await this.fetchOrFetchAndMeasure(
      promise,
      ChainMetrics.FetchDenomsTrace,
    )

    return denomTraces.map((denomTrace) => ({
      path: denomTrace.getPath(),
      baseDenom: denomTrace.getBaseDenom(),
    }))
  }

  async fetchDenomTrace(denom: string) {
    const hash = denom.replace('ibc/', '')

    const denomTraceFromCache = await this.fetchDenomTraceFromCache(hash)

    if (denomTraceFromCache) {
      return denomTraceFromCache
    }

    const denomTraceFromSentry = await this.fetchDenomTraceFromSentry(hash)

    if (denomTraceFromSentry) {
      this.cachedDenomTraces[hash] = denomTraceFromSentry

      return denomTraceFromSentry
    }

    throw new Error(`Denom trace not found for ${denom}`)
  }

  getCoinGeckoId(symbol: string): string {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getCoinGeckoIdFromSymbol(symbol)
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  getPeggyDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { erc20TokenMeta } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return erc20TokenMeta.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return erc20TokenMeta.getMetaByAddress(address)
  }

  async getIbcDenomTokenMeta(denom: string): Promise<TokenMeta | undefined> {
    const { erc20TokenMeta } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace(denom)

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  async getDenomTokenMeta(denom: string): Promise<TokenMeta | undefined> {
    return denom.startsWith('ibc/')
      ? this.getIbcDenomTokenMeta(denom)
      : this.getPeggyDenomTokenMeta(denom)
  }

  async getPeggyDenomToken(denom: string): Promise<Token> {
    const tokenMeta = await this.getPeggyDenomTokenMeta(denom)

    return Promise.resolve(
      TokenTransformer.tokenMetaToToken(tokenMeta, denom) as Token,
    )
  }

  async getIbcDenomToken(denom: string): Promise<IbcToken> {
    const { baseDenom, path } = await this.fetchDenomTrace(denom)
    const tokenMeta = this.getTokenMetaDataBySymbol(baseDenom)

    return {
      baseDenom,
      channelId: path.replace('transfer/', ''),
      ...TokenTransformer.tokenMetaToToken(tokenMeta, denom),
    } as IbcToken
  }

  async getDenomToken(denom: string): Promise<Token> {
    const tokenMeta = await (denom.startsWith('ibc/')
      ? this.getIbcDenomToken(denom)
      : this.getPeggyDenomToken(denom))

    return TokenTransformer.tokenMetaToToken(tokenMeta, denom) as Token
  }

  async getDenomTokenThrow(denom: string): Promise<Token> {
    const tokenMeta = await this.getDenomToken(denom)

    if (!tokenMeta) {
      throw new Error(`Token meta for ${denom} denom does not exist`)
    }

    return TokenTransformer.tokenMetaToToken(tokenMeta, denom) as Token
  }

  async getCoinToken(coin: UiSupplyCoin): Promise<Token> {
    return this.getDenomToken(coin.denom)
  }

  async getPeggyCoinToken(coin: UiSupplyCoin): Promise<Token> {
    const tokenMeta = await this.getPeggyDenomTokenMeta(coin.denom)

    return Promise.resolve(
      TokenTransformer.tokenMetaToToken(tokenMeta, coin.denom) as Token,
    )
  }

  async getIbcCoinToken(coin: UiSupplyCoin): Promise<IbcToken> {
    const { baseDenom, path } = await this.fetchDenomTrace(coin.denom)
    const tokenMeta = this.getTokenMetaDataBySymbol(baseDenom)

    return {
      baseDenom,
      channelId: path.replace('transfer/', ''),
      ...TokenTransformer.tokenMetaToToken(tokenMeta, coin.denom),
    } as IbcToken
  }

  async getSupplyWithToken(supply: UiSupplyCoin[]): Promise<Token[]> {
    return (
      (await Promise.all(supply.map(this.getCoinToken.bind(this)))) as Token[]
    ).filter((token) => token)
  }

  async getPeggySupplyWithToken(supply: UiSupplyCoin[]): Promise<Token[]> {
    return (
      (await Promise.all(
        supply.map(this.getPeggyCoinToken.bind(this)),
      )) as Token[]
    ).filter((token) => token)
  }

  async getIbcSupplyWithToken(supply: UiSupplyCoin[]): Promise<IbcToken[]> {
    return (
      (await Promise.all(
        supply.map(this.getIbcCoinToken.bind(this)),
      )) as IbcToken[]
    ).filter((token) => token)
  }

  async getBalancesWithToken(
    balances: BankBalances,
    ibcBalances: BankBalances,
  ): Promise<{
    bankBalancesWithToken: BankBalanceWithToken[]
    ibcBankBalancesWithToken: IbcBankBalanceWithToken[]
  }> {
    const bankBalancesWithToken = (
      await Promise.all(
        Object.keys(balances).map(async (denom) => ({
          denom,
          balance: balances[denom],
          token: await this.getPeggyDenomToken(denom),
        })),
      )
    ).filter((balance) => balance.token !== undefined) as BankBalanceWithToken[]

    const ibcBankBalancesWithToken = (
      await Promise.all(
        Object.keys(ibcBalances).map(async (denom) => {
          const { baseDenom, path } = await this.fetchDenomTrace(denom)

          return {
            denom,
            baseDenom,
            balance: ibcBalances[denom],
            channelId: path.replace('transfer/', ''),
            token: await this.getIbcDenomToken(denom),
          }
        }),
      )
    ).filter(
      (balance) => balance.token !== undefined,
    ) as IbcBankBalanceWithToken[]

    return {
      bankBalancesWithToken,
      ibcBankBalancesWithToken,
    }
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
    const appendLabel = async (
      coin: UiSupplyCoin,
    ): Promise<UiSupplyCoinForSelect> => {
      const tokenMeta = await this.getDenomTokenMeta(coin.denom)

      return {
        ...coin,
        code: coin.denom,
        label: tokenMeta ? tokenMeta.symbol : coin.denom,
      }
    }

    const bankSupplyWithLabel = await Promise.all(bankSupply.map(appendLabel))
    const ibcBankSupplyWithLabel = await Promise.all(
      ibcBankSupply.map(appendLabel),
    )

    return {
      bankSupply: bankSupplyWithLabel,
      ibcBankSupply: ibcBankSupplyWithLabel,
    }
  }

  async getSubaccountBalanceWithToken(
    balance: UiSubaccountBalance,
  ): Promise<SubaccountBalanceWithToken> {
    return {
      token: await this.getDenomToken(balance.denom),
      denom: balance.denom,
      availableBalance: balance.availableBalance,
      totalBalance: balance.totalBalance,
    }
  }

  async getSubaccountBalancesWithToken(
    balances: UiSubaccountBalance[],
  ): Promise<SubaccountBalanceWithToken[]> {
    return (
      await Promise.all(
        balances.map(this.getSubaccountBalanceWithToken.bind(this)),
      )
    ).filter(
      (balance) => balance.token !== undefined,
    ) as SubaccountBalanceWithToken[]
  }

  async getSpotMarketWithToken(
    market: UiBaseSpotMarket,
  ): Promise<UiBaseSpotMarketWithToken> {
    const slug = market.ticker.replace('/', '-').replace(' ', '-').toLowerCase()

    const baseToken = await this.getDenomToken(market.baseDenom)
    const quoteToken = await this.getDenomToken(market.quoteDenom)

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
    } as UiBaseSpotMarketWithToken
  }

  async getSpotMarketsWithToken(
    markets: UiBaseSpotMarket[],
  ): Promise<UiBaseSpotMarketWithToken[]> {
    return (
      await Promise.all(markets.map(this.getSpotMarketWithToken.bind(this)))
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseSpotMarketWithToken[]
  }

  async getDerivativeMarketWithToken(
    market: UiBaseDerivativeMarket,
  ): Promise<UiBaseDerivativeMarketWithToken> {
    const slug = market.ticker
      .replace('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = slug.split('-')
    const baseToken = TokenTransformer.tokenMetaToToken(
      this.getTokenMetaDataBySymbol(baseTokenSymbol),
      baseTokenSymbol,
    )
    const quoteToken = await this.getDenomToken(market.quoteDenom)

    if (quoteToken && !quoteToken.coinGeckoId) {
      quoteToken.coinGeckoId = this.getCoinGeckoId(quoteToken.symbol)
    }

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as UiBaseDerivativeMarketWithToken
  }

  async getDerivativeMarketsWithToken(
    markets: UiBaseDerivativeMarket[],
  ): Promise<UiBaseDerivativeMarketWithToken[]> {
    return (
      await Promise.all(
        markets.map(this.getDerivativeMarketWithToken.bind(this)),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseDerivativeMarketWithToken[]
  }

  async getBridgeTransactionWithToken(
    transaction: UiBridgeTransaction,
  ): Promise<UiBridgeTransactionWithToken> {
    const transactionExists =
      transaction && transaction.denom && Object.keys(transaction).length > 0

    if (!transactionExists) {
      return {} as UiBridgeTransactionWithToken
    }

    // Edge case for transferring INJ from IBC chains to Injective chain [osmosis]
    if (
      transaction.denom.startsWith('transfer') &&
      transaction.denom.endsWith('inj')
    ) {
      return {
        ...transaction,
        token: this.getTokenMetaDataBySymbol('INJ') as Token,
      }
    }

    const tokenFromSymbol = this.getTokenMetaDataBySymbol(
      transaction.denom,
    ) as Token

    if (tokenFromSymbol) {
      return {
        ...transaction,
        token: TokenTransformer.tokenMetaToToken(
          tokenFromSymbol,
          tokenFromSymbol.address,
        ) as Token,
      }
    }

    const tokenFromDenom = (await this.getDenomToken(
      transaction.denom,
    )) as Token

    return {
      ...transaction,
      token: tokenFromDenom,
    }
  }

  async getBridgeTransactionsWithToken(
    transactions: UiBridgeTransaction[],
  ): Promise<UiBridgeTransactionWithToken[]> {
    return (
      await Promise.all(
        transactions.map(this.getBridgeTransactionWithToken.bind(this)),
      )
    ).filter(
      (transaction) => transaction && transaction.token !== undefined,
    ) as UiBridgeTransactionWithToken[]
  }

  private async fetchDenomTraceFromSentry(denom: string) {
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

  private async fetchDenomTraceFromCache(denom: string) {
    return this.cachedDenomTraces[denom.replace('ibc/', '')]
  }
}
