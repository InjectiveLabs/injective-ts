import {
  Token,
  TokenInfo,
  TokenMeta,
  TokenMetaUtils,
  TokenInfoFactory,
  TokenMetaUtilsFactory,
} from '@injectivelabs/token-metadata'
import { GeneralException, ErrorType } from '@injectivelabs/exceptions'
import { DenomTrace } from '@injectivelabs/chain-api/ibc/applications/transfer/v1/transfer_pb'
import { fromUtf8 } from '../../../utils/utf8'
import { sha256 } from '../../../utils/crypto'
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

  protected tokenInfoFactory: TokenInfoFactory

  protected tokenMetaUtils: TokenMetaUtils

  protected ibcApi: ChainGrpcIbcApi

  constructor(network: Network = Network.Mainnet) {
    this.tokenInfoFactory = TokenInfoFactory.make(network)
    this.tokenMetaUtils = TokenMetaUtilsFactory.make(network)
    this.ibcApi = new ChainGrpcIbcApi(getNetworkEndpoints(network).grpc)
  }

  async getDenomTokenInfo(denom: string): Promise<TokenInfo | undefined> {
    const token = this.tokenInfoFactory.toToken(denom)

    if (token) {
      return token
    }

    /**
     * If IBC denom is not within the hardcoded
     * IBC hashes we should query the denom traces API
     * to find the token meta for the denom
     */
    if (denom.startsWith('ibc')) {
      const meta = await this.getIbcDenomTokenMeta(denom)

      if (!meta) {
        return
      }

      return TokenInfo.fromMeta(denom, meta)
    }

    /**
     * TODO: Handle CW20 addresses and fetch metadata from
     * the CW20 contract address
     */

    return
  }

  async getDenomToken(denom: string): Promise<Token | undefined> {
    const tokenInfo = await this.getDenomTokenInfo(denom)

    return tokenInfo ? tokenInfo.toToken() : undefined
  }

  getCoinGeckoId(denom: string): string {
    return this.tokenMetaUtils.getCoinGeckoIdFromSymbol(denom)
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    return this.tokenMetaUtils.getMetaBySymbol(symbol)
  }

  getTokenMetaDataByAddress(address: string): TokenMeta | undefined {
    return this.tokenMetaUtils.getMetaByAddress(address)
  }

  getTokenMetaDataByName(name: string): TokenMeta | undefined {
    return this.tokenMetaUtils.getMetaByName(name)
  }

  private async getIbcDenomTokenMeta(denom: string) {
    const hash = denom.replace('ibc/', '')

    if (Object.keys(this.cachedDenomTraces).length === 0) {
      await this.fetchAndCacheDenomTraces()
    }

    const cachedDenomTrace = this.cachedDenomTraces[hash]

    if (cachedDenomTrace) {
      return this.tokenMetaUtils.getMetaBySymbol(cachedDenomTrace.baseDenom)
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

    return this.tokenMetaUtils.getMetaBySymbol(denomTrace.baseDenom)
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
