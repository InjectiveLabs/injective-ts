import { Network, isTestnet } from '@injectivelabs/networks'
import { GeneralException } from '@injectivelabs/exceptions'
import { INJ_DENOM } from '@injectivelabs/utils'
import { TokenInfo } from './TokenInfo'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  getTokensBySymbolForDevnet,
  getTokensBySymbolForDevnet1,
  getTokensBySymbolForDevnet2,
  getTokensBySymbolForTestnet,
} from './tokens/network'
import { Token, TokenMeta, TokenType } from './types'
import tokensBySymbol from './tokens/tokens'
import { getTokenFromMeta, isCw20ContractAddress } from './utils'

export class TokenFactory {
  public tokenMetaUtils: TokenMetaUtils

  constructor(tokenMetaUtils: TokenMetaUtils) {
    this.tokenMetaUtils = tokenMetaUtils
  }

  static make(network: Network = Network.Mainnet): TokenFactory {
    if (isTestnet(network)) {
      return new TokenFactory(new TokenMetaUtils(getTokensBySymbolForTestnet()))
    }

    if (network === Network.Devnet) {
      return new TokenFactory(new TokenMetaUtils(getTokensBySymbolForDevnet()))
    }

    if (network === Network.Devnet1) {
      return new TokenFactory(new TokenMetaUtils(getTokensBySymbolForDevnet1()))
    }

    if (network === Network.Devnet2) {
      return new TokenFactory(new TokenMetaUtils(getTokensBySymbolForDevnet2()))
    }

    return new TokenFactory(new TokenMetaUtils(tokensBySymbol))
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
    if (!isCw20ContractAddress(address)) {
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

    if (!address) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }

    if (isCw20ContractAddress(address)) {
      const tokenMeta = this.tokenMetaUtils.getMetaByAddress(address)

      return tokenMeta
        ? {
            ...tokenMeta,
            tokenType: TokenType.TokenFactory,
          }
        : undefined
    }

    const tokenMeta =
      this.tokenMetaUtils.getMetaBySymbol(address) ||
      this.tokenMetaUtils.getMetaByName(address)

    return tokenMeta
      ? {
          ...tokenMeta,
          tokenType: TokenType.TokenFactory,
        }
      : undefined
  }
}
