import { Network } from '@injectivelabs/networks'
import { GeneralException } from '@injectivelabs/exceptions'
import { INJ_DENOM } from '@injectivelabs/utils'
import { TokenInfo } from './TokenInfo'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  tokensBySymbolForDevnet,
  tokensBySymbolForDevnet1,
  tokensBySymbolForDevnet2,
  tokensBySymbolForTestnet,
} from './tokens/network'
import { Token, TokenMeta, TokenType } from './types'
import tokensBySymbol from './tokens/tokens'
import { getTokenFromMeta } from './utils'

export class TokenFactory {
  public tokenMetaUtils: TokenMetaUtils

  constructor(tokenMetaUtils: TokenMetaUtils) {
    this.tokenMetaUtils = tokenMetaUtils
  }

  static make(network: Network = Network.Mainnet): TokenFactory {
    switch (network) {
      case Network.Mainnet:
      case Network.MainnetK8s:
      case Network.MainnetLB:
      case Network.Local:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbol))
      case Network.Devnet:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbolForDevnet))
      case Network.Devnet1:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbolForDevnet1))
      case Network.Devnet2:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbolForDevnet2))
      case Network.Testnet:
      case Network.TestnetOld:
      case Network.TestnetK8s:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbolForTestnet))
      default:
        return new TokenFactory(new TokenMetaUtils(tokensBySymbol))
    }
  }

  toToken(denom: string): Token | undefined {
    const isDenom =
      denom.startsWith('ibc/') ||
      denom.startsWith('peggy') ||
      denom.startsWith('factory/')

    if (denom === INJ_DENOM) {
      return getTokenFromMeta(
        this.tokenMetaUtils.getMetaBySymbol(denom)!,
        denom,
      )
    }

    try {
      if (!isDenom) {
        const bySymbol = this.tokenMetaUtils.getMetaBySymbol(denom)

        if (bySymbol) {
          return getTokenFromMeta(bySymbol, denom)
        }

        const byAddress = this.tokenMetaUtils.getMetaByAddress(denom)

        if (byAddress) {
          return getTokenFromMeta(byAddress, denom)
        }

        const byName = this.tokenMetaUtils.getMetaByName(denom)

        if (byName) {
          return getTokenFromMeta(byName, denom)
        }

        return
      }

      if (denom.startsWith('ibc/')) {
        const meta = this.getIbcDenomTokenMeta(denom)

        return meta ? getTokenFromMeta(meta, denom) : undefined
      }

      if (denom.startsWith('factory/')) {
        const meta = this.getFactoryDenomTokenMeta(denom)

        return meta ? getTokenFromMeta(meta, denom) : undefined
      }

      if (denom.startsWith('peggy')) {
        const meta = this.getPeggyDenomTokenMeta(denom)

        return meta ? getTokenFromMeta(meta, denom) : undefined
      }

      const meta = this.getCw20DenomTokenMeta(denom)

      return meta ? getTokenFromMeta(meta, denom) : undefined
    } catch (e) {
      return undefined
    }
  }

  toTokenInfo(denom: string): TokenInfo | undefined {
    const token = this.toToken(denom)

    return token ? TokenInfo.fromToken(token) : undefined
  }

  getPeggyDenomTokenMeta(denom: string): TokenMeta | undefined {
    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    if (!address.startsWith('0x')) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid ERC20 address`),
      )
    }

    if (address.length !== 42) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid ERC20 address`),
      )
    }

    return this.tokenMetaUtils.getMetaByAddress(address)
  }

  getCw20DenomTokenMeta(address: string): TokenMeta | undefined {
    if (!address.startsWith('inj')) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }

    return this.tokenMetaUtils.getMetaByAddress(address)
  }

  getIbcDenomTokenMeta(hash: string): TokenMeta | undefined {
    return this.tokenMetaUtils.getMetaByHash(hash)
  }

  getFactoryDenomTokenMeta(denom: string): TokenMeta | undefined {
    const [address] = denom.split('/').reverse()

    if (!address || !address.startsWith('inj')) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }

    const tokenMeta = this.tokenMetaUtils.getMetaByAddress(address)

    return tokenMeta
      ? {
          ...tokenMeta,
          tokenType: TokenType.TokenFactory,
        }
      : undefined
  }
}
