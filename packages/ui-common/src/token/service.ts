import {
  Erc20TokenMetaFactory,
  Erc20TokenMeta,
  TokenMeta,
} from '@injectivelabs/token-metadata'
import { IBCConsumer } from '@injectivelabs/chain-consumer'
import { INJ_DENOM } from '../constants'
import { ServiceOptions } from '../types'
import { TokenTransformer } from './transformer'
import { BankBalances, UiSupplyCoin } from '../bank/types'
import {
  BankBalanceWithTokenMetaData,
  IbcBankBalanceWithTokenMetaData,
  IbcToken,
  Token,
  UiSupplyCoinForSelect,
} from './types'

export class TokenService {
  // @ts-expect-error
  private options: ServiceOptions

  private ibcConsumer: IBCConsumer

  private erc20TokenMetaFactory: Erc20TokenMeta

  constructor({ options }: { options: ServiceOptions }) {
    this.options = options
    this.ibcConsumer = new IBCConsumer(options.endpoints.sentryGrpcApi)
    this.erc20TokenMetaFactory = Erc20TokenMetaFactory.make(options.network)
  }

  async fetchDenomTrace(denom: string) {
    const hash = denom.replace('ibc/', '')
    const denomTrace = await this.ibcConsumer.fetchDenomTrace(hash)

    if (!denomTrace) {
      throw new Error(`Denom trace not found for ${denom}`)
    }

    return {
      path: denomTrace.getPath(),
      baseDenom: denomTrace.getBaseDenom(),
    }
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { erc20TokenMetaFactory } = this

    return erc20TokenMetaFactory.getMetaBySymbol(symbol)
  }

  getTokenMetaData(denom: string): TokenMeta | undefined {
    const { erc20TokenMetaFactory } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return erc20TokenMetaFactory.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return erc20TokenMetaFactory.getMetaByAddress(address)
  }

  async getIbcTokenMetaData(denom: string): Promise<TokenMeta | undefined> {
    const { erc20TokenMetaFactory } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace(denom)

    return erc20TokenMetaFactory.getMetaBySymbol(symbol)
  }

  async getTokenMetaDataWithIbc(denom: string): Promise<TokenMeta | undefined> {
    return denom.startsWith('ibc/')
      ? this.getIbcTokenMetaData(denom)
      : this.getTokenMetaData(denom)
  }

  async fetchSupplyWithTokenMeta(supply: UiSupplyCoin[]): Promise<Token[]> {
    return supply
      .map(({ denom }: UiSupplyCoin) =>
        TokenTransformer.tokenMetaToToken(this.getTokenMetaData(denom), denom),
      )
      .filter((token) => token) as Token[]
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

  async fetchIbcSupplyWithTokenMeta(
    supply: UiSupplyCoin[],
  ): Promise<IbcToken[]> {
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

  async fetchSupplyWithLabel({
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
}
