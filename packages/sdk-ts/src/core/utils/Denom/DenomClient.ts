import {
  Token,
  TokenInfo,
  TokenMeta,
  TokenMetaUtils,
  TokenInfoFactory,
  TokenMetaUtilsFactory,
} from '@injectivelabs/token-metadata'
import { Network } from '@injectivelabs/networks'

/**
 * This client can be used to fetch token
 * denoms in a fully sync way (without API calls)
 *
 * @category Utility Classes
 */
export class DenomClient {
  protected tokenInfoFactory: TokenInfoFactory

  protected tokenMetaUtils: TokenMetaUtils

  constructor(network: Network = Network.Mainnet) {
    this.tokenInfoFactory = TokenInfoFactory.make(network)
    this.tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  }

  getDenomTokenInfo(denom: string): TokenInfo | undefined {
    return this.tokenInfoFactory.toTokenInfo(denom)
  }

  getDenomToken(denom: string): Token | undefined {
    return this.tokenInfoFactory.toToken(denom)
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

  getCoinGeckoId(denom: string): string {
    return this.tokenMetaUtils.getCoinGeckoIdFromSymbol(denom)
  }
}
