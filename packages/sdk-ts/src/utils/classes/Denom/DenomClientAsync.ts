import {
  TokenMetaUtilFactory,
  TokenMetaUtil,
  TokenMeta,
  IbcToken,
  Token,
} from '@injectivelabs/token-metadata'
import { INJ_DENOM } from '@injectivelabs/utils'
import { GeneralException, ErrorType } from '@injectivelabs/exceptions'
import { checkIsIbcDenomCanonical, tokenMetaToToken } from './utils'
import { DenomTrace } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/transfer_pb'
import { fromUtf8 } from '../../utf8'
import { sha256 } from '../../crypto'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcIbcApi } from '../../../client/chain/grpc/ChainGrpcIbcApi'

/**
 * This client can be used to fetch token
 * denoms including API calls as well
 *
 * @category Utility Classes
 */
export class DenomClientAsync {
  protected cachedDenomTraces: Record<string, DenomTrace.AsObject> = {}

  protected tokenMetaUtil: TokenMetaUtil

  protected ibcApi: ChainGrpcIbcApi

  constructor(network: Network = Network.Mainnet) {
    this.tokenMetaUtil = TokenMetaUtilFactory.make(network)
    this.ibcApi = new ChainGrpcIbcApi(getNetworkEndpoints(network).grpc)
  }

  getPeggyDenomToken(denom: string): Token {
    const tokenMeta = this.getPeggyDenomTokenMeta(denom)

    return tokenMetaToToken(tokenMeta, denom) as Token
  }

  getFactoryDenomToken(denom: string): Token {
    const tokenMeta = this.getFactoryDenomTokenMeta(denom)

    return tokenMetaToToken(tokenMeta, denom) as Token
  }

  getCw20DenomToken(address: string): Token {
    const tokenMeta = this.getCw20DenomTokenMeta(address)

    return tokenMetaToToken(
      tokenMeta,
      tokenMeta ? tokenMeta.symbol : address,
    ) as Token
  }

  async getIbcDenomToken(denom: string): Promise<IbcToken> {
    const { baseDenom, path } = await this.fetchDenomTrace(denom)
    const tokenMeta = await this.getDenomToken(baseDenom)

    return {
      baseDenom,
      isCanonical: checkIsIbcDenomCanonical(path),
      channelId: path.replace('transfer/', ''),
      ...tokenMetaToToken(tokenMeta, denom),
    } as IbcToken
  }

  async getDenomToken(denom: string): Promise<Token | undefined> {
    const isDenom =
      denom.startsWith('ibc/') ||
      denom.startsWith('peggy') ||
      denom.startsWith('factory/') ||
      denom.toLowerCase() === INJ_DENOM

    if (!isDenom) {
      const bySymbol = this.getTokenMetaDataBySymbol(denom)

      if (bySymbol) {
        return tokenMetaToToken(bySymbol, denom) as Token
      }

      const byAddress = this.getTokenMetaDataByAddress(denom)

      if (byAddress) {
        return tokenMetaToToken(byAddress, denom) as Token
      }

      const byName = this.getTokenMetaDataByName(denom)

      if (byName) {
        return tokenMetaToToken(byName, denom) as Token
      }

      return
    }

    try {
      if (denom.startsWith('ibc/')) {
        return this.getIbcDenomToken(denom)
      }

      if (denom.startsWith('factory/')) {
        return this.getFactoryDenomToken(denom)
      }

      if (denom.startsWith('peggy')) {
        return this.getPeggyDenomToken(denom)
      }

      return tokenMetaToToken(
        await this.getDenomTokenMeta(denom),
        denom,
      ) as Token
    } catch (e) {
      return
    }
  }

  async getDenomTokenThrow(denom: string): Promise<Token> {
    const tokenMeta = await this.getDenomToken(denom)

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

  getCoinGeckoId(denom: string): string {
    const { tokenMetaUtil } = this

    return tokenMetaUtil.getCoinGeckoIdFromSymbol(denom)
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    return tokenMetaUtil.getMetaBySymbol(symbol)
  }

  getTokenMetaDataByAddress(address: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    return tokenMetaUtil.getMetaByAddress(address)
  }

  getTokenMetaDataByName(name: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    return tokenMetaUtil.getMetaByName(name)
  }

  private getPeggyDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return tokenMetaUtil.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return tokenMetaUtil.getMetaByAddress(address)
  }

  private getCw20DenomTokenMeta(address: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    if (!address.startsWith('inj')) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }
    return tokenMetaUtil.getMetaByAddress(address)
  }

  private async getIbcDenomTokenMeta(
    denom: string,
  ): Promise<TokenMeta | undefined> {
    const { tokenMetaUtil } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace(denom)

    return tokenMetaUtil.getMetaBySymbol(symbol)
  }

  private getFactoryDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    const [, , address] = denom.split('/')

    return tokenMetaUtil.getMetaByAddress(address)
  }

  private async getDenomTokenMeta(
    denom: string,
  ): Promise<TokenMeta | undefined> {
    const { tokenMetaUtil } = this

    if (denom === INJ_DENOM) {
      return tokenMetaUtil.getMetaBySymbol(INJ_DENOM.toUpperCase())
    }

    if (denom.startsWith('ibc/')) {
      return await this.getIbcDenomTokenMeta(denom)
    }

    if (denom.startsWith('factory/')) {
      return this.getFactoryDenomTokenMeta(denom)
    }

    return this.getPeggyDenomTokenMeta(denom)
  }

  async fetchDenomTrace(denom: string) {
    const hash = denom.replace('ibc/', '')

    if (Object.keys(this.cachedDenomTraces).length === 0) {
      await this.fetchAndCacheDenomTraces()
    }

    const cachedDenomTrace = this.cachedDenomTraces[hash]

    if (cachedDenomTrace) {
      return cachedDenomTrace
    }

    const denomTrace = await this.ibcApi.fetchDenomTrace(hash)

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

  private async fetchAndCacheDenomTraces() {
    const denomTraces = await this.ibcApi.fetchDenomsTrace()
    const denomHashes = denomTraces.map((trace) => {
      return {
        trace: trace,
        hash: Buffer.from(
          sha256(fromUtf8(`${trace.path}/${trace.baseDenom}`)),
        ).toString('hex'),
      }
    })

    this.cachedDenomTraces = denomHashes.reduce(
      (denomTraces, denomTrace) => ({
        ...denomTraces,
        [denomTrace.hash.toUpperCase()]:
          denomTrace.trace as DenomTrace.AsObject,
      }),
      {},
    )
  }
}
