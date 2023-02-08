import { Network } from '@injectivelabs/networks'
import { ChainId, Coin } from '@injectivelabs/ts-types'
import {
  DenomClientAsync,
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
  IbcBankBalanceWithToken,
  SubaccountBalanceWithToken,
  UiBridgeTransaction,
  UiBridgeTransactionWithToken,
} from '../types'
import { TokenType } from '@injectivelabs/token-metadata'
import { Token } from '@injectivelabs/token-metadata'
import { awaitAll } from '@injectivelabs/utils'

/**
 * With the TokenService class we can convert objects
 * with denoms to append token metadata information
 */
export class TokenService {
  public network: Network

  public chainId: ChainId

  public denomClient: DenomClientAsync

  constructor({ chainId, network }: { chainId: ChainId; network: Network }) {
    this.network = network
    this.chainId = chainId
    this.denomClient = new DenomClientAsync(network)
  }

  async coinsToCoinsWithToken(supply: Coin[]): Promise<Token[]> {
    const tokens = await awaitAll(supply, (coin) =>
      this.denomClient.getDenomToken(coin.denom),
    )

    return tokens.filter((token) => token) as Token[]
  }

  async supplyToSupplyWithToken(supply: Coin[]): Promise<Token[]> {
    return this.coinsToCoinsWithToken(supply)
  }

  async balancesToBalancesWithToken(
    balances: BankBalances,
    ibcBalances: BankBalances,
  ): Promise<{
    bankBalancesWithToken: BankBalanceWithToken[]
    ibcBankBalancesWithToken: IbcBankBalanceWithToken[]
  }> {
    const bankBalancesWithToken = (
      await awaitAll(Object.keys(balances), async (denom) => ({
        denom,
        balance: balances[denom],
        token: await this.denomClient.getDenomToken(denom),
      }))
    ).filter((balance) => balance.token !== undefined) as BankBalanceWithToken[]

    const ibcBankBalancesWithToken = (
      await awaitAll(Object.keys(ibcBalances), async (denom) => {
        const { baseDenom, path } = await this.denomClient.fetchDenomTrace(
          denom,
        )

        return {
          denom,
          baseDenom,
          balance: ibcBalances[denom],
          channelId: path.replace('transfer/', ''),
          token: await this.denomClient.getDenomToken(denom),
        }
      })
    ).filter(
      (balance) => balance.token !== undefined,
    ) as IbcBankBalanceWithToken[]

    return {
      bankBalancesWithToken,
      ibcBankBalancesWithToken,
    }
  }

  async cw20BalancesToCw20BalancesWithToken(
    cw20Balances: ExplorerCW20BalanceWithToken[],
  ): Promise<Cw20BalanceWithToken[]> {
    const balancesWithToken = await awaitAll(cw20Balances, async (balance) => {
      const token = await this.denomClient.getDenomToken(
        balance.contractAddress,
      )

      if (!token) {
        return
      }

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
    })

    return balancesWithToken.filter(
      (balance) => balance,
    ) as Cw20BalanceWithToken[]
  }

  async cw20AccountBalancesToCw20BalancesWithToken({
    contractAddress,
    contractAccountsBalance,
  }: {
    contractAddress: string
    contractAccountsBalance: ContractAccountBalance[]
  }): Promise<ContractAccountBalanceWithToken[]> {
    const token = await this.denomClient.getDenomToken(contractAddress)
    const balances = contractAccountsBalance.map((balance) => {
      if (!token) {
        return
      }

      return {
        ...balance,
        token: {
          ...token,
          type: TokenType.Cw20,
        },
      }
    })

    return balances.filter(
      (balance) => balance,
    ) as ContractAccountBalanceWithToken[]
  }

  async supplyToSupplyWithLabel({
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
      const tokenMeta = await this.denomClient.getDenomToken(coin.denom)

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

  async subaccountBalanceToSubaccountBalanceWithToken(
    balance: UiSubaccountBalance,
  ): Promise<SubaccountBalanceWithToken> {
    return {
      token: (await this.denomClient.getDenomToken(balance.denom)) as Token,
      denom: balance.denom,
      availableBalance: balance.availableBalance,
      totalBalance: balance.totalBalance,
    }
  }

  async subaccountBalancesToSubaccountBalancesWithToken(
    balances: UiSubaccountBalance[],
  ): Promise<SubaccountBalanceWithToken[]> {
    return (
      await awaitAll(
        balances,
        this.subaccountBalanceToSubaccountBalanceWithToken.bind(this),
      )
    ).filter(
      (balance) => balance.token !== undefined,
    ) as SubaccountBalanceWithToken[]
  }

  async spotMarketToSpotMarketWithToken(
    market: UiBaseSpotMarket,
  ): Promise<UiBaseSpotMarketWithToken> {
    const baseToken = await this.denomClient.getDenomToken(market.baseDenom)
    const quoteToken = await this.denomClient.getDenomToken(market.quoteDenom)
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

  async spotMarketsToSpotMarketsWithToken(
    markets: UiBaseSpotMarket[],
  ): Promise<UiBaseSpotMarketWithToken[]> {
    return (
      await awaitAll(markets, this.spotMarketToSpotMarketWithToken.bind(this))
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as UiBaseSpotMarketWithToken[]
  }

  async derivativeMarketToDerivativeMarketWithToken<
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
      await this.denomClient.getDenomToken(baseTokenSymbol),
      baseTokenSymbol,
    )
    const quoteToken = await this.denomClient.getDenomToken(market.quoteDenom)

    return {
      ...market,
      slug,
      baseToken,
      quoteToken,
    } as unknown as R
  }

  async derivativeMarketsToDerivativeMarketsWithToken(
    markets: Array<UiBasePerpetualMarket | UiBaseExpiryFuturesMarket>,
  ): Promise<
    Array<PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug>
  > {
    return (
      await awaitAll(
        markets,
        this.derivativeMarketToDerivativeMarketWithToken.bind(this),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as Array<
      PerpetualMarketWithTokenAndSlug | ExpiryFuturesMarketWithTokenAndSlug
    >
  }

  async binaryOptionsToBinaryOptionsMarketWithToken(
    market: UiBaseBinaryOptionsMarket,
  ): Promise<BinaryOptionsMarketWithTokenAndSlug> {
    const quoteToken = await this.denomClient.getDenomToken(market.quoteDenom)
    const slug = market.ticker
      .replaceAll('/', '-')
      .replaceAll(' ', '-')
      .toLowerCase()
    const [baseTokenSymbol] = quoteToken
      ? market.ticker.replace(quoteToken.symbol, '')
      : market.ticker.replace('/', '')
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

  async binaryOptionsMarketsToBinaryOptionsMarketsWithToken(
    markets: UiBaseBinaryOptionsMarket[],
  ): Promise<BinaryOptionsMarketWithTokenAndSlug[]> {
    return (
      await awaitAll(
        markets,
        this.binaryOptionsToBinaryOptionsMarketWithToken.bind(this),
      )
    ).filter(
      (market) =>
        market.baseToken !== undefined && market.quoteToken !== undefined,
    ) as BinaryOptionsMarketWithTokenAndSlug[]
  }

  async bridgeTransactionToBridgeTransactionWithToken(
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
        token: (await this.denomClient.getDenomToken('INJ')) as Token,
      }
    }

    const tokenFromDenomAsSymbol = (await this.denomClient.getDenomToken(
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

    const tokenFromDenom = (await this.denomClient.getDenomToken(
      transaction.denom,
    )) as Token

    return {
      ...transaction,
      token: tokenFromDenom,
    }
  }

  async bridgeTransactionToBridgeTransactionsWithToken(
    transactions: UiBridgeTransaction[],
  ): Promise<UiBridgeTransactionWithToken[]> {
    return (
      await awaitAll(
        transactions,
        this.bridgeTransactionToBridgeTransactionWithToken.bind(this),
      )
    ).filter(
      (transaction) => transaction && transaction.token !== undefined,
    ) as UiBridgeTransactionWithToken[]
  }
}
