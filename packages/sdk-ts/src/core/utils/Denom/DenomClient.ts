import {
  Token,
  TokenFactory,
  TokenMetaBase,
  TokenMetaUtils,
  TokenMetaUtilsFactory,
} from '@injectivelabs/token-metadata'
import { Network } from '@injectivelabs/networks'

/**
 * This client can be used to fetch token from the existing token-metadata
 * package.
 *
 * If you want to have a mode advanced version of the DenomClient
 * (including the ability to fetch metadata from an API)
 * use the DenomClientAsync from the @injectivelabs/sdk-ui-ts package
 *
 * @category Utility Classes
 */
export class DenomClient {
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

  getTokenMetaDataBySymbol(symbol: string): TokenMetaBase | undefined {
    return this.tokenMetaUtils.getMetaBySymbol(symbol)
  }

  getTokenMetaDataByAddress(address: string): TokenMetaBase | undefined {
    return this.tokenMetaUtils.getMetaByAddress(address)
  }

  getCoinGeckoId(denom: string): string {
    return this.tokenMetaUtils.getCoinGeckoIdFromSymbol(denom)
  }
}
