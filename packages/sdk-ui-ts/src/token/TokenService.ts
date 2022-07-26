import { Network } from '@injectivelabs/networks'
import { ChainId, Coin } from '@injectivelabs/ts-types'
import {
  checkIsIbcDenomCanonical,
  Denom,
  tokenMetaToToken,
} from '@injectivelabs/sdk-ts'
import {
  BankBalances,
  UiBaseSpotMarket,
  UiBaseSpotMarketWithToken,
  UiSubaccountBalance,
  CoinWithLabel,
  UiBaseBinaryOptionsMarket,
  BinaryOptionsMarketWithTokenAndSlug,
  UiBasePerpetualMarket,
  UiBaseExpiryFuturesMarket,
  PerpetualMarketWithTokenAndSlug,
  ExpiryFuturesMarketWithTokenAndSlug,
} from '../client/types'
import {
  BankBalanceWithToken,
  DenomTrace,
  IbcBankBalanceWithToken,
  SubaccountBalanceWithToken,
  UiBridgeTransaction,
  UiBridgeTransactionWithToken,
} from '../types'
import { ibcTokens, TokenType } from '@injectivelabs/token-metadata'
import { Token, IbcToken } from '@injectivelabs/token-metadata'

export class TokenService {
  public network: Network

  public chainId: ChainId

  protected cachedDenomTraces: Record<string, DenomTrace> = {}

  constructor({ chainId, network }: { chainId: ChainId; network: Network }) {
    this.network = network
    this.chainId = chainId
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

  async getDenomToken(denom: string): Promise<Token> {
    const { network } = this

    if (denom.startsWith('ibc/')) {
      const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

      if (denomTraceFromCache) {
        const tokenMeta = await new Denom(
          denomTraceFromCache.baseDenom,
          network,
        ).getTokenMetaDataBySymbol()

        return {
          channelId: denomTraceFromCache.path.replace('transfer/', ''),
          isCanonical: checkIsIbcDenomCanonical(denomTraceFromCache.path),
          ...denomTraceFromCache,
          ...tokenMetaToToken(tokenMeta, denom),
        } as IbcToken
      }

      return (await new Denom(denom, network).getIbcDenomToken()) as IbcToken
    }

    return await new Denom(denom, network).getDenomToken()
  }

  async getDenomTrace(denom: string) {
    const { network } = this

    if (!denom.startsWith('ibc/')) {
      throw new Error(`${denom} is not an IBC denom`)
    }

    const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

    if (denomTraceFromCache) {
      return denomTraceFromCache
    }

    const { baseDenom, path } = await new Denom(
      denom,
      network,
    ).fetchDenomTrace()

    return {
      path,
      baseDenom,
    }
  }

  async getCoinsToken(supply: Coin[]): Promise<Token[]> {
    const tokens = (await Promise.all(
      supply.map((coin) => {
        return this.getDenomToken(coin.denom)
      }),
    )) as Token[]

    return tokens.filter((token) => token)
  }

  async getSupplyWithToken(supply: Coin[]): Promise<Token[]> {
    const tokens = (await Promise.all(
      supply.map((coin) => {
        return this.getDenomToken(coin.denom)
      }),
    )) as Token[]

    return tokens.filter((token) => token)
  }

  async getIbcSupplyWithToken(supply: Coin[]): Promise<Token[]> {
    const tokens = (await Promise.all(
      supply.map((coin) => {
        return this.getDenomToken(coin.denom)
      }),
    )) as IbcToken[]

    return tokens.filter((token) => token)
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
          token: await this.getDenomToken(denom),
        })),
      )
    ).filter((balance) => balance.token !== undefined) as BankBalanceWithToken[]

    const ibcBankBalancesWithToken = (
      await Promise.all(
        Object.keys(ibcBalances).map(async (denom) => {
          const { baseDenom, path } = await this.getDenomTrace(denom)

          return {
            denom,
            baseDenom,
            isIbc: true,
            balance: ibcBalances[denom],
            channelId: path.replace('transfer/', ''),
            token: await this.getDenomToken(denom),
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
    bankSupply: Coin[]
    ibcBankSupply: Coin[]
  }): Promise<{
    bankSupply: CoinWithLabel[]
    ibcBankSupply: CoinWithLabel[]
  }> {
    const appendLabel = async (coin: Coin): Promise<CoinWithLabel> => {
      const tokenMeta = await this.getDenomToken(coin.denom)

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
      token: (await this.getDenomToken(balance.denom)) as Token,
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

  async getDerivativeMarketWithToken<
    T extends UiBasePerpetualMarket | UiBaseExpiryFuturesMarket,
    R extends
      | PerpetualMarketWithTokenAndSlug
      | ExpiryFuturesMarketWithTokenAndSlug,
  >(market: T): Promise<R> {
    const slug = market.ticker
      .replaceAll('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = slug.split('-')
    const baseToken = tokenMetaToToken(
      await this.getDenomToken(baseTokenSymbol),
      baseTokenSymbol,
    )
    const quoteToken = await this.getDenomToken(market.quoteDenom)

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as unknown as R
  }

  async getDerivativeMarketsWithToken(
    markets: Array<UiBasePerpetualMarket | UiBaseExpiryFuturesMarket>,
  ): Promise<
    Array<PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug>
  > {
    return (
      await Promise.all(
        markets.map(this.getDerivativeMarketWithToken.bind(this)),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as Array<
      PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug
    >
  }

  async getBinaryOptionsMarketWithToken(
    market: UiBaseBinaryOptionsMarket,
  ): Promise<BinaryOptionsMarketWithTokenAndSlug> {
    const quoteToken = await this.getDenomToken(market.quoteDenom)
    const slug = market.ticker
      .replaceAll('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = market.ticker.replace(quoteToken.symbol, '')
    const baseToken = {
      denom: slug,
      logo: 'injective-v3.svg',
      icon: 'injective-v3.svg',
      symbol: baseTokenSymbol,
      name: baseTokenSymbol,
      tokenType: TokenType.Erc20 /* Todo */,
      decimals: 18,
      address: '',
      coinGeckoId: '',
    }

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as BinaryOptionsMarketWithTokenAndSlug
  }

  async getBinaryOptionsMarketsWithToken(
    markets: UiBaseBinaryOptionsMarket[],
  ): Promise<BinaryOptionsMarketWithTokenAndSlug[]> {
    return (
      await Promise.all(
        markets.map(this.getBinaryOptionsMarketWithToken.bind(this)),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as BinaryOptionsMarketWithTokenAndSlug[]
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
        token: (await this.getDenomToken('INJ')) as Token,
      }
    }

    const tokenFromSymbol = (await this.getDenomToken(
      transaction.denom,
    )) as Token

    if (tokenFromSymbol) {
      return {
        ...transaction,
        token: tokenMetaToToken(
          tokenFromSymbol,
          tokenFromSymbol.address!,
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

  private async fetchDenomTraceFromCache(denom: string) {
    return this.cachedDenomTraces[denom.replace('ibc/', '')]
  }
}
