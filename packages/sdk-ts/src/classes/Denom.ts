import { ChainGrpcIbcApi } from '../client/chain/grpc/ChainGrpcIbcApi'
import {
  TokenMetaUtilFactory,
  TokenMetaUtil,
} from '@injectivelabs/token-metadata'
import { TokenMeta, IbcToken, Token } from '@injectivelabs/token-metadata'
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
    icon: tokenMeta.logo,
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

  protected tokenMetaUtil: TokenMetaUtil

  constructor(denom: string, network: Network = Network.Mainnet) {
    this.denom = denom

    const endpoints = getEndpointsForNetwork(network)
    this.ibcApi = new ChainGrpcIbcApi(endpoints.sentryGrpcApi)
    this.tokenMetaUtil = TokenMetaUtilFactory.make(network)
  }

  async getPeggyDenomToken(): Promise<Token> {
    const { denom } = this
    const tokenMeta = await this.getPeggyDenomTokenMeta()

    return Promise.resolve(tokenMetaToToken(tokenMeta, denom) as Token)
  }

  async getIbcDenomToken(): Promise<IbcToken> {
    const { denom } = this
    const { baseDenom, path } = await this.fetchDenomTrace()
    const tokenMeta = await new Denom(baseDenom).getDenomToken()

    return {
      baseDenom,
      isIbc: true,
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
      const bySymbol = this.getTokenMetaDataBySymbol()

      if (bySymbol) {
        return tokenMetaToToken(bySymbol, denom) as Token
      }

      const byAddress = this.getTokenMetaDataByAddress()

      if (byAddress) {
        return tokenMetaToToken(byAddress, denom) as Token
      }

      return {
        denom,
        name: denom,
        icon: '',
        logo: '',
        symbol: '',
        decimals: 18,
        address: '',
        coinGeckoId: '',
      }
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

  getCoinGeckoId(): string {
    const { tokenMetaUtil, denom } = this

    return tokenMetaUtil.getCoinGeckoIdFromSymbol(denom)
  }

  getTokenMetaDataBySymbol(): TokenMeta | undefined {
    const { tokenMetaUtil, denom } = this

    return tokenMetaUtil.getMetaBySymbol(denom)
  }

  getTokenMetaDataByAddress(): TokenMeta | undefined {
    const { tokenMetaUtil, denom } = this

    return tokenMetaUtil.getMetaByAddress(denom)
  }

  async fetchDenomTrace() {
    const { denom } = this
    const denomTrace = await this.ibcApi.fetchDenomTrace(
      denom.replace('ibc/', ''),
    )

    if (!denomTrace) {
      throw new Error(`Denom trace not found for ${denom}`)
    }

    return {
      path: denomTrace.path,
      baseDenom: denomTrace.baseDenom,
    }
  }

  private getPeggyDenomTokenMeta(): TokenMeta | undefined {
    const { denom } = this
    const { tokenMetaUtil } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return tokenMetaUtil.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return tokenMetaUtil.getMetaByAddress(address)
  }

  private async getIbcDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { tokenMetaUtil } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace()

    return tokenMetaUtil.getMetaBySymbol(symbol)
  }

  private async getDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { denom } = this

    return denom.startsWith('ibc/')
      ? this.getIbcDenomTokenMeta()
      : this.getPeggyDenomTokenMeta()
  }
}
