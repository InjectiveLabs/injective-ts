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
  UiBridgeTransactionWithTokenMeta,
} from './types'
import { UiSubaccountBalance } from '../subaccount/types'
import { BaseService } from '../BaseService'
import { UiBridgeTransaction } from '../bridge/types'

export class TokenService extends BaseService {
  protected ibcConsumer: IBCConsumer

  protected erc20TokenMeta: Erc20TokenMeta

  constructor(options: ServiceOptions) {
    super(options)
    this.ibcConsumer = new IBCConsumer(this.endpoints.sentryGrpcApi)
    this.erc20TokenMeta = Erc20TokenMetaFactory.make(this.options.network)
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

  async getAnyDenomTokenMeta(denom: string): Promise<TokenMeta | undefined> {
    return denom.startsWith('ibc/')
      ? this.getIbcDenomTokenMeta(denom)
      : this.getPeggyDenomTokenMeta(denom)
  }

  async getDenomToken(denom: string): Promise<Token> {
    const tokenMeta = await this.getAnyDenomTokenMeta(denom)

    return TokenTransformer.tokenMetaToToken(tokenMeta, denom) as Token
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

  async getCoinToken(coin: UiSupplyCoin): Promise<Token> {
    const tokenMeta = await this.getAnyDenomTokenMeta(coin.denom)

    return TokenTransformer.tokenMetaToToken(tokenMeta, coin.denom) as Token
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
          this.getPeggyDenomTokenMeta(denom),
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
      const tokenMeta = await this.getAnyDenomTokenMeta(coin.denom)

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

  async getSubaccountBalanceWithTokenMeta(
    balance: UiSubaccountBalance,
  ): Promise<SubaccountBalanceWithTokenMetaData> {
    const token = TokenTransformer.tokenMetaToToken(
      await this.getAnyDenomTokenMeta(balance.denom),
      balance.denom,
    ) as Token

    return {
      token,
      denom: balance.denom,
      availableBalance: balance.availableBalance,
      totalBalance: balance.totalBalance,
    }
  }

  async getSubaccountBalancesWithTokenMeta(
    balances: UiSubaccountBalance[],
  ): Promise<SubaccountBalanceWithTokenMetaData[]> {
    return (
      await Promise.all(
        balances.map(this.getSubaccountBalanceWithTokenMeta.bind(this)),
      )
    ).filter(
      (balance) => balance.token !== undefined,
    ) as SubaccountBalanceWithTokenMetaData[]
  }

  async getSpotMarketWithTokenMeta(
    market: UiBaseSpotMarket,
  ): Promise<UiBaseSpotMarketWithTokenMeta> {
    const slug = market.ticker.replace('/', '-').replace(' ', '-').toLowerCase()

    const baseToken = TokenTransformer.tokenMetaToToken(
      await this.getAnyDenomTokenMeta(market.baseDenom),
      market.baseDenom,
    )
    const quoteToken = TokenTransformer.tokenMetaToToken(
      await this.getAnyDenomTokenMeta(market.quoteDenom),
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
    } as UiBaseSpotMarketWithTokenMeta
  }

  async getSpotMarketsWithTokenMeta(
    markets: UiBaseSpotMarket[],
  ): Promise<UiBaseSpotMarketWithTokenMeta[]> {
    return (
      await Promise.all(markets.map(this.getSpotMarketWithTokenMeta.bind(this)))
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseSpotMarketWithTokenMeta[]
  }

  async getDerivativeMarketWithTokenMeta(
    market: UiBaseDerivativeMarket,
  ): Promise<UiBaseDerivativeMarketWithTokenMeta> {
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
      await this.getAnyDenomTokenMeta(market.quoteDenom),
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
    } as UiBaseDerivativeMarketWithTokenMeta
  }

  async getDerivativeMarketsWithTokenMeta(
    markets: UiBaseDerivativeMarket[],
  ): Promise<UiBaseDerivativeMarketWithTokenMeta[]> {
    return (
      await Promise.all(
        markets.map(this.getDerivativeMarketWithTokenMeta.bind(this)),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseDerivativeMarketWithTokenMeta[]
  }

  async getBridgeTransactionWithTokenMeta(
    transaction: UiBridgeTransaction,
  ): Promise<UiBridgeTransactionWithTokenMeta> {
    const transactionExists =
      transaction && transaction.denom && Object.keys(transaction).length > 0

    if (!transactionExists) {
      return {} as UiBridgeTransactionWithTokenMeta
    }

    const tokenFromSymbol = this.getTokenMetaDataBySymbol(
      transaction.denom,
    ) as Token

    if (tokenFromSymbol) {
      return {
        ...transaction,
        token: tokenFromSymbol,
      }
    }

    const tokenFromDenom = (await this.getAnyDenomTokenMeta(
      transaction.denom,
    )) as Token

    return {
      ...transaction,
      token: tokenFromDenom,
    }
  }

  async getBridgeTransactionsWithTokenMeta(
    transactions: UiBridgeTransaction[],
  ): Promise<UiBridgeTransactionWithTokenMeta[]> {
    return (
      await Promise.all(
        transactions.map(this.getBridgeTransactionWithTokenMeta.bind(this)),
      )
    ).filter(
      (transaction) => transaction && transaction.token !== undefined,
    ) as UiBridgeTransactionWithTokenMeta[]
  }
}
