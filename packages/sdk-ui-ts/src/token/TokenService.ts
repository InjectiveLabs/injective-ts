import { Network } from '@injectivelabs/networks'
import { ChainId, Coin } from '@injectivelabs/ts-types'
import {
  DenomClientAsync,
  checkIsIbcDenomCanonical,
  ExplorerCW20BalanceWithToken,
  tokenMetaToToken,
  ContractAccountBalance,
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
  ContractAccountBalanceWithToken,
  Cw20BalanceWithToken,
  DenomTrace,
  IbcBankBalanceWithToken,
  SubaccountBalanceWithToken,
  UiBridgeTransaction,
  UiBridgeTransactionWithToken,
} from '../types'
import { TokenType } from '@injectivelabs/token-metadata'
import { Token, IbcToken } from '@injectivelabs/token-metadata'

export class TokenService {
  public network: Network

  public chainId: ChainId

  public denomClient: DenomClientAsync

  protected cachedDenomTraces: Record<string, DenomTrace> = {}

  constructor({ chainId, network }: { chainId: ChainId; network: Network }) {
    this.network = network
    this.chainId = chainId
    this.denomClient = new DenomClientAsync(network)
  }

  async getDenomToken(denom: string): Promise<Token> {
    const { network } = this

    if (denom.startsWith('ibc/')) {
      const denomTrace = await this.denomClient.getDenomToken(denom)
      const tokenMeta = await this.denomClient.getTokenMetaDataBySymbol(
        denomTrace.baseDenom,
        network,
      )

      return {
        channelId: denomTrace.path.replace('transfer/', ''),
        isCanonical: checkIsIbcDenomCanonical(denomTrace.path),
        ...denomTrace,
        ...tokenMetaToToken(tokenMeta, denom),
      } as IbcToken
    }

    return await this.denomClient.getDenomToken(denom)
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
          const { baseDenom, path } = await this.denomClient.fetchDenomTrace(
            denom,
          )

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

  async getCW20BalancesWithToken(
    cw20Balances: ExplorerCW20BalanceWithToken[],
  ): Promise<Cw20BalanceWithToken[]> {
    return await Promise.all(
      cw20Balances.map(async (balance) => {
        const token = await this.getDenomToken(balance.contractAddress)

        return {
          ...balance,
          token: {
            ...token,
            type: TokenType.Cw20,
          },
          denom: token.symbol,
          contractDetails: {
            address: balance.contractAddress,
          },
        }
      }),
    )
  }

  async getCW20AccountsBalanceWithToken({
    contractAccountsBalance,
    contractAddress,
  }: {
    contractAccountsBalance: ContractAccountBalance[]
    contractAddress: string
  }): Promise<ContractAccountBalanceWithToken[]> {
    const token = await this.getDenomToken(contractAddress)

    return contractAccountsBalance.map((balance) => {
      return {
        ...balance,
        token: {
          ...token,
          type: TokenType.Cw20,
        },
      }
    })
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
    const baseToken = await this.getDenomToken(market.baseDenom)
    const quoteToken = await this.getDenomToken(market.quoteDenom)
    const slug =
      baseToken && quoteToken
        ? `${baseToken.symbol.toLowerCase()}-${quoteToken.symbol.toLowerCase()}`
        : market.ticker.replace('/', '-').replace(' ', '-').toLowerCase()

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

    const tokenFromDenomAsSymbol = (await this.getDenomToken(
      transaction.denom,
    )) as Token

    if (tokenFromDenomAsSymbol) {
      return {
        ...transaction,
        token: tokenMetaToToken(
          tokenFromDenomAsSymbol,
          tokenFromDenomAsSymbol.erc20Address ||
            tokenFromDenomAsSymbol.cw20Address ||
            '',
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
