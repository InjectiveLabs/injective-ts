import {
  Token,
  TokenMeta,
  TokenFactory,
  TokenMetaUtils,
  TokenMetaUtilsFactory,
} from '@injectivelabs/token-metadata'
import { Network } from '@injectivelabs/networks'

/**
 * This client can be used to fetch token
 * denoms in a fully sync way (without API calls)
 *
 * @category Utility Classes
 *
 * @deprecated use DenomClient instead (they are the same)
 */
export class DenomClientSync {
  protected tokenFactory: TokenFactory

  protected tokenMetaUtils: TokenMetaUtils

  constructor(network: Network = Network.Mainnet) {
    this.tokenFactory = TokenFactory.make(network)
    this.tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  }

  getDenomToken(denom: string): Token | undefined {
    return this.tokenFactory.toToken(denom)
  }

  getDenomsToken(denoms: string[]): Array<Token | undefined> {
    return denoms.map((denom) => this.getDenomToken(denom))
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
