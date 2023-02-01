import { ChainGrpcIbcApi } from '../../../client/chain/grpc/ChainGrpcIbcApi'
import {
  TokenMetaUtilFactory,
  TokenMetaUtil,
  TokenMeta,
  IbcToken,
  Token,
} from '@injectivelabs/token-metadata'
import { INJ_DENOM } from '@injectivelabs/utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { GeneralException, ErrorType } from '@injectivelabs/exceptions'
import {
  checkIsIbcDenomCanonical,
  getTokenTypeFromDenom,
  tokenMetaToToken,
} from './utils'

/**
 * @category Utility Classes
 */
export class Denom {
  protected denom: string

  protected ibcApi: ChainGrpcIbcApi

  protected tokenMetaUtil: TokenMetaUtil

  constructor(denom: string, network: Network = Network.Mainnet) {
    this.denom = denom

    const endpoints = getNetworkEndpoints(network)
    this.ibcApi = new ChainGrpcIbcApi(endpoints.grpc)
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
      isCanonical: checkIsIbcDenomCanonical(path),
      channelId: path.replace('transfer/', ''),
      ...tokenMetaToToken(tokenMeta, denom),
    } as IbcToken
  }

  async getFactoryDenomToken(): Promise<Token> {
    const { denom } = this
    const tokenMeta = await this.getFactoryDenomTokenMeta()

    return tokenMetaToToken(tokenMeta, denom) as Token
  }

  async getCw20DenomToken(): Promise<Token> {
    const { denom } = this
    const tokenMeta = await this.getCw20DenomTokenMeta()

    return tokenMetaToToken(
      tokenMeta,
      tokenMeta ? tokenMeta.symbol : denom,
    ) as Token
  }

  async getDenomToken(): Promise<Token> {
    const { denom } = this
    const isDenom =
      denom.startsWith('ibc/') ||
      denom.startsWith('peggy') ||
      denom.startsWith('factory/') ||
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
        tokenType: getTokenTypeFromDenom(denom),
        logo: '',
        symbol: '',
        decimals: 18,
        erc20Address: '',
        cw20Address: '',
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
      throw new GeneralException(
        new Error(`Token meta for ${denom} denom does not exist`),
        {
          type: ErrorType.NotFoundError,
        },
      )
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
      throw new GeneralException(
        new Error(`Denom trace not found for ${denom}`),
        {
          type: ErrorType.NotFoundError,
        },
      )
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

  private async getCw20DenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { denom } = this
    const { tokenMetaUtil } = this

    if (!denom.startsWith('inj')) {
      throw new GeneralException(
        new Error(`The address ${denom} is not a valid CW20 address`),
      )
    }
    return tokenMetaUtil.getMetaByAddress(denom)
  }

  private async getIbcDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { tokenMetaUtil } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace()

    return tokenMetaUtil.getMetaBySymbol(symbol)
  }

  private async getFactoryDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { tokenMetaUtil, denom } = this

    const [, , address] = denom.split('/')

    return tokenMetaUtil.getMetaByAddress(address)
  }

  private async getDenomTokenMeta(): Promise<TokenMeta | undefined> {
    const { denom, tokenMetaUtil } = this

    if (denom === INJ_DENOM) {
      return tokenMetaUtil.getMetaBySymbol('INJ')
    }

    if (denom.startsWith('ibc/')) {
      return this.getIbcDenomTokenMeta()
    }

    if (denom.startsWith('factory/')) {
      return this.getFactoryDenomTokenMeta()
    }

    return this.getPeggyDenomTokenMeta()
  }
}
