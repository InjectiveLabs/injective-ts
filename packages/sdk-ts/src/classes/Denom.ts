import { ChainGrpcIbcApi } from '../client/chain/grpc/ChainGrpcIbcApi'
import {
  Erc20TokenMetaFactory,
  Erc20TokenMeta,
} from '@injectivelabs/token-metadata'
import { IbcToken, Token } from '../types/denom'
import { TokenMeta } from '@injectivelabs/token-metadata'
import { INJ_DENOM } from '../utils'
import { getEndpointsForNetwork, Network } from '@injectivelabs/networks'

export const tokenMetaToToken = (
  tokenMeta: TokenMeta | undefined,
  denom: string,
): Token | undefined => {
  if (!tokenMeta) {
    return
  }

  return {
    denom,
    logo: tokenMeta.logo,
    symbol: tokenMeta.symbol,
    name: tokenMeta.name,
    decimals: tokenMeta.decimals,
    address: tokenMeta.address,
    coinGeckoId: tokenMeta.coinGeckoId,
  }
}

export class Denom {
  protected denom: string

  protected ibcApi: ChainGrpcIbcApi

  protected erc20TokenMeta: Erc20TokenMeta

  constructor(denom: string, network: Network = Network.Mainnet) {
    this.denom = denom

    const endpoints = getEndpointsForNetwork(network)
    this.ibcApi = new ChainGrpcIbcApi(endpoints.sentryGrpcApi)
    this.erc20TokenMeta = Erc20TokenMetaFactory.make(network)
  }

  async getPeggyDenomToken(): Promise<Token> {
    const { denom } = this
    const tokenMeta = await this.getPeggyDenomTokenMeta()

    return Promise.resolve(tokenMetaToToken(tokenMeta, denom) as Token)
  }

  async getIbcDenomToken(): Promise<IbcToken> {
    const { denom } = this
    const { baseDenom, path } = await this.fetchDenomTrace()
    const tokenMeta = this.getTokenMetaDataBySymbol(baseDenom)

    return {
      baseDenom,
      channelId: path.replace('transfer/', ''),
      ...tokenMetaToToken(tokenMeta, denom),
    } as IbcToken
  }

  async getDenomToken(): Promise<Token> {
    const { denom } = this
    const isDenom =
      denom.startsWith('ibc/') ||
      denom.startsWith('peggy') ||
      denom.toLowerCase() === INJ_DENOM

    if (!isDenom) {
      return (await this.getTokenMetaDataBySymbol(denom)) as Token
    }

    const tokenMeta = await this.getDenomTokenMeta()

    return tokenMetaToToken(tokenMeta, denom) as Token
  }

  async getDenomTokenThrow(): Promise<Token> {
    const { denom } = this
    const tokenMeta = await this.getDenomToken()

    if (!tokenMeta) {
      throw new Error(`Token meta for ${denom} denom does not exist`)
    }

    return tokenMetaToToken(tokenMeta, denom) as Token
  }

  getCoinGeckoId(symbol: string): string {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getCoinGeckoIdFromSymbol(symbol)
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { erc20TokenMeta } = this

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  async fetchDenomTrace() {
    const { denom } = this
    const response = await this.ibcApi.fetchDenomTrace(
      denom.replace('ibc/', ''),
    )
    const denomTrace = response.getDenomTrace()

    if (!denomTrace) {
      throw new Error(`Denom trace not found for ${denom}`)
    }

    return {
      path: denomTrace.getPath(),
      baseDenom: denomTrace.getBaseDenom(),
    }
  }

  private getPeggyDenomTokenMeta(): TokenMeta | undefined {
    const { denom } = this
    const { erc20TokenMeta } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return erc20TokenMeta.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return erc20TokenMeta.getMetaByAddress(address)
  }

  private async getIbcDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { erc20TokenMeta } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace()

    return erc20TokenMeta.getMetaBySymbol(symbol)
  }

  private async getDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { denom } = this

    return denom.startsWith('ibc/')
      ? this.getIbcDenomTokenMeta()
      : this.getPeggyDenomTokenMeta()
  }
}
