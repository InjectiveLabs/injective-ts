import { Network } from '@injectivelabs/networks'
import { ChainId, Coin } from '@injectivelabs/ts-types'
import { tokenMetaToToken } from '@injectivelabs/sdk-ts'
import {
  BankBalances,
  UiBaseDerivativeMarket,
  UiBaseDerivativeMarketWithToken,
  UiBaseSpotMarket,
  UiBaseSpotMarketWithToken,
  UiSubaccountBalance,
  CoinWithLabel,
} from '../client/types'
import {
  BankBalanceWithToken,
  IbcBankBalanceWithToken,
  SubaccountBalanceWithToken,
  Token,
  UiBridgeTransaction,
  UiBridgeTransactionWithToken,
} from '../types'
import { DenomFactory } from './DenomFactory'
import { TokenPrice } from './TokenPrice'

export class TokenService {
  public network: Network

  public chainId: ChainId

  public denom: DenomFactory

  public price: TokenPrice

  constructor({
    chainId,
    network,
    coinGeckoOptions,
  }: {
    chainId: ChainId
    network: Network
    coinGeckoOptions: { baseUrl: string; apiKey: string }
  }) {
    this.network = network
    this.chainId = chainId
    this.denom = new DenomFactory(network)
    this.price = new TokenPrice(coinGeckoOptions)
  }

  async getSupplyWithToken(supply: Coin[]): Promise<Token[]> {
    const tokens = (await Promise.all(
      supply.map((coin) => {
        return this.denom.getDenomToken(coin.denom)
      }),
    )) as Token[]

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
          token: await this.denom.getDenomToken(denom),
        })),
      )
    ).filter((balance) => balance.token !== undefined) as BankBalanceWithToken[]

    const ibcBankBalancesWithToken = (
      await Promise.all(
        Object.keys(ibcBalances).map(async (denom) => {
          const { baseDenom, path } = await this.denom.getDenomTrace(denom)

          return {
            denom,
            baseDenom,
            balance: ibcBalances[denom],
            channelId: path.replace('transfer/', ''),
            token: await this.denom.getDenomToken(denom),
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
      const tokenMeta = await this.denom.getDenomToken(coin.denom)

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
      token: (await this.denom.getDenomToken(balance.denom)) as Token,
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

    const baseToken = await this.denom.getDenomToken(market.baseDenom)
    const quoteToken = await this.denom.getDenomToken(market.quoteDenom)

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
    const baseToken = tokenMetaToToken(
      await this.denom.getDenomToken(baseTokenSymbol),
      baseTokenSymbol,
    )
    const quoteToken = await this.denom.getDenomToken(market.quoteDenom)

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
        token: (await this.denom.getDenomToken('INJ')) as Token,
      }
    }

    const tokenFromSymbol = (await this.denom.getDenomToken(
      transaction.denom,
    )) as Token

    if (tokenFromSymbol) {
      return {
        ...transaction,
        token: tokenMetaToToken(
          tokenFromSymbol,
          tokenFromSymbol.address,
        ) as Token,
      }
    }

    const tokenFromDenom = (await this.denom.getDenomToken(
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
}
