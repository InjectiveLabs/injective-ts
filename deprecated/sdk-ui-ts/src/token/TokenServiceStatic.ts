import { Network } from '@injectivelabs/networks'
import { ChainId, Coin } from '@injectivelabs/ts-types'
import {
  DenomClient,
  ContractAccountBalance,
  ExplorerCW20BalanceWithToken,
} from '@injectivelabs/sdk-ts'
import {
  BankBalances,
  UiBaseSpotMarket,
  UiSubaccountBalance,
  UiBasePerpetualMarket,
  UiBaseSpotMarketWithToken,
  UiBaseBinaryOptionsMarket,
  UiBaseExpiryFuturesMarket,
  PerpetualMarketWithTokenAndSlug,
  BinaryOptionsMarketWithTokenAndSlug,
  ExpiryFuturesMarketWithTokenAndSlug,
} from '../client/types'
import {
  BalanceWithToken,
  UiBridgeTransaction,
  SubaccountBalanceWithToken,
  UiBridgeTransactionWithToken,
} from '../types'
import {
  Token,
  TokenType,
  getUnknownTokenWithSymbol,
} from '@injectivelabs/token-metadata'
import { spotMarketTickerMaps } from './maps'

/**
 * With the TokenService class we can convert objects
 * with denoms to append token metadata information
 */
export class TokenServiceStatic {
  public network: Network

  public chainId: ChainId

  public denomClient: DenomClient

  public shouldReturnUnknown: boolean

  constructor({
    chainId,
    network,
    shouldReturnUnknown = false,
  }: {
    chainId: ChainId
    network: Network
    shouldReturnUnknown?: boolean
  }) {
    this.shouldReturnUnknown = shouldReturnUnknown
    this.network = network
    this.chainId = chainId
    this.denomClient = new DenomClient(network)
  }

  toCoinsWithToken(supply: Coin[]): Token[] {
    const tokens = supply.map((coin) => this.getDenom(coin.denom))

    return tokens.filter((token) => token) as Token[]
  }

  toSupplyWithToken(supply: Coin[]): Token[] {
    return this.toCoinsWithToken(supply)
  }

  toBalancesWithToken(
    balances: BankBalances,
    ibcBalances: BankBalances,
  ): {
    bankBalancesWithToken: BalanceWithToken[]
    ibcBankBalancesWithToken: BalanceWithToken[]
  } {
    const bankBalancesWithToken = Object.keys(balances)
      .map((denom) => ({
        denom,
        balance: balances[denom],
        token: this.getDenom(denom),
      }))
      .filter((balance) => balance.token !== undefined) as BalanceWithToken[]

    const ibcBankBalancesWithToken = Object.keys(ibcBalances)
      .map((denom) => {
        return {
          denom,
          balance: ibcBalances[denom],
          token: this.getDenom(denom),
        }
      })
      .filter((balance) => balance.token !== undefined) as BalanceWithToken[]

    return {
      bankBalancesWithToken,
      ibcBankBalancesWithToken,
    }
  }

  toCw20BalancesWithToken(
    cw20Balances: ExplorerCW20BalanceWithToken[],
  ): BalanceWithToken[] {
    const balancesWithToken = cw20Balances.map((balance) => {
      const token = this.getDenom(balance.contractAddress)

      if (!token) {
        return
      }

      return {
        ...balance,
        token,
        denom: token.denom,
      }
    })

    return balancesWithToken.filter((balance) => balance) as BalanceWithToken[]
  }

  toContractCw20BalancesWithToken({
    contractAddress,
    contractAccountsBalance,
  }: {
    contractAddress: string
    contractAccountsBalance: ContractAccountBalance[]
  }): BalanceWithToken[] {
    const token = this.getDenom(contractAddress)
    const defaultToken = {
      name: contractAddress,
      logo: '',
      denom: contractAddress,
      tokenType: TokenType.Cw20,
    } as Token

    // When token can't be fetched from the token-metadata, we use a default token.
    const tokenOrDefaultToken = token || defaultToken

    return contractAccountsBalance.map((balance) => {
      return {
        ...balance,
        token: tokenOrDefaultToken,
        denom: tokenOrDefaultToken.denom || contractAddress,
      }
    })
  }

  toSubaccountBalanceWithToken(
    balance: UiSubaccountBalance,
  ): SubaccountBalanceWithToken {
    return {
      token: this.getDenom(balance.denom) as Token,
      denom: balance.denom,
      availableBalance: balance.availableBalance,
      totalBalance: balance.totalBalance,
    }
  }

  toSubaccountBalancesWithToken(
    balances: UiSubaccountBalance[],
  ): SubaccountBalanceWithToken[] {
    return balances
      .map(this.toSubaccountBalanceWithToken.bind(this))
      .filter(
        (balance) => balance.token !== undefined,
      ) as SubaccountBalanceWithToken[]
  }

  toSpotMarketWithToken(market: UiBaseSpotMarket): UiBaseSpotMarketWithToken {
    const baseToken = this.getDenom(market.baseDenom)
    const quoteToken = this.getDenom(market.quoteDenom)
    const slug =
      baseToken && quoteToken
        ? `${baseToken.symbol.toLowerCase()}-${quoteToken.symbol.toLowerCase()}`
        : market.ticker.replace('/', '-').replace(' ', '-').toLowerCase()

    return spotMarketTickerMaps({ market, slug, baseToken, quoteToken })
  }

  toSpotMarketsWithToken(
    markets: UiBaseSpotMarket[],
  ): UiBaseSpotMarketWithToken[] {
    return markets
      .map(this.toSpotMarketWithToken.bind(this))
      .filter(
        (market) =>
          market.baseToken !== undefined && market.quoteToken !== undefined,
      ) as UiBaseSpotMarketWithToken[]
  }

  toDerivativeMarketWithToken<
    T extends UiBasePerpetualMarket | UiBaseExpiryFuturesMarket,
    R extends
      | PerpetualMarketWithTokenAndSlug
      | ExpiryFuturesMarketWithTokenAndSlug,
  >(market: T): R {
    const slug = market.ticker
      .replaceAll('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = slug.split('-')
    const baseToken = this.denomClient.getTokenBySymbol(baseTokenSymbol)
    const quoteToken = this.getDenom(market.quoteDenom)

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as unknown as R
  }

  toDerivativeMarketsWithToken(
    markets: Array<UiBasePerpetualMarket | UiBaseExpiryFuturesMarket>,
  ): Array<
    PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug
  > {
    return markets
      .map(this.toDerivativeMarketWithToken.bind(this))
      .filter(
        (market) =>
          market.baseToken !== undefined && market.quoteToken !== undefined,
      ) as Array<
      PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug
    >
  }

  toBinaryOptionsMarketWithToken(
    market: UiBaseBinaryOptionsMarket,
  ): BinaryOptionsMarketWithTokenAndSlug {
    const quoteToken = this.getDenom(market.quoteDenom)
    const slug = market.ticker
      .replaceAll('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = quoteToken
      ? market.ticker.replace(quoteToken.symbol, '')
      : market.ticker.replace('/', '')
    const baseToken = {
      denom: slug,
      logo: 'injective-v3.png',
      icon: 'injective-v3.png',
      symbol: baseTokenSymbol,
      name: baseTokenSymbol,
      decimals: 18,
      coinGeckoId: '',
      tokenType: TokenType.Native,
    } as Token

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as BinaryOptionsMarketWithTokenAndSlug
  }

  toBinaryOptionsMarketsWithToken(
    markets: UiBaseBinaryOptionsMarket[],
  ): BinaryOptionsMarketWithTokenAndSlug[] {
    return markets
      .map(this.toBinaryOptionsMarketWithToken.bind(this))
      .filter(
        (market) =>
          market.baseToken !== undefined && market.quoteToken !== undefined,
      ) as BinaryOptionsMarketWithTokenAndSlug[]
  }

  toBridgeTransactionWithToken(
    transaction: UiBridgeTransaction,
  ): UiBridgeTransactionWithToken {
    const transactionExists =
      transaction && transaction.denom && Object.keys(transaction).length > 0

    if (!transactionExists) {
      return {} as UiBridgeTransactionWithToken
    }

    /**
     * Transferring native INJ from IBC chain
     * to Injective (ex: Osmosis -> Injective)
     */
    if (
      transaction.denom.startsWith('transfer') &&
      transaction.denom.endsWith('inj')
    ) {
      return {
        ...transaction,
        token: this.getDenom('INJ')!,
      }
    }

    const tokenFromDenomAsSymbol = this.getDenom(transaction.denom) as Token

    if (tokenFromDenomAsSymbol) {
      return {
        ...transaction,
        token: tokenFromDenomAsSymbol,
      }
    }

    return {
      ...transaction,
      token: getUnknownTokenWithSymbol(transaction.denom),
    } as UiBridgeTransactionWithToken
  }

  toBridgeTransactionsWithToken(
    transactions: UiBridgeTransaction[],
  ): UiBridgeTransactionWithToken[] {
    return transactions
      .map(this.toBridgeTransactionWithToken.bind(this))
      .filter(
        (transaction) => transaction && transaction.token !== undefined,
      ) as UiBridgeTransactionWithToken[]
  }

  private getDenom(denom: string) {
    const token = this.denomClient.getDenomToken(denom)

    return this.shouldReturnUnknown && !token
      ? getUnknownTokenWithSymbol(denom)
      : token
  }
}
