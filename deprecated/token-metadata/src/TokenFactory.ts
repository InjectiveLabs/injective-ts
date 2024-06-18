import { Network, isTestnet } from '@injectivelabs/networks'
import { GeneralException } from '@injectivelabs/exceptions'
import { INJ_DENOM } from '@injectivelabs/utils'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  getTokensBySymbolForDevnet,
  getTokensBySymbolForDevnet1,
  getTokensBySymbolForDevnet2,
  getTokensBySymbolForTestnet,
} from './tokens/network'
import { Token, TokenMetaBase } from './types'
import tokensBySymbol from './tokens/tokens'
import {
  getTokenFromMeta,
  getTokenFromMetaIncludingIbcBaseDenoms,
} from './utils/token'
import { isCw20ContractAddress } from './utils/helpers'

export class TokenFactory {
  public tokenMetaUtils: TokenMetaUtils

  constructor(tokenMetaUtils: TokenMetaUtils) {
    this.tokenMetaUtils = tokenMetaUtils
  }

  static make(
    network: Network = Network.Mainnet,
    registry: Record<string, TokenMetaBase> = {},
  ): TokenFactory {
    if (isTestnet(network)) {
      return new TokenFactory(
        new TokenMetaUtils({ ...getTokensBySymbolForTestnet(), ...registry }),
      )
    }

    if (network === Network.Devnet) {
      return new TokenFactory(
        new TokenMetaUtils({ ...getTokensBySymbolForDevnet(), ...registry }),
      )
    }

    if (network === Network.Devnet1) {
      return new TokenFactory(
        new TokenMetaUtils({ ...getTokensBySymbolForDevnet1(), ...registry }),
      )
    }

    if (network === Network.Devnet2) {
      return new TokenFactory(
        new TokenMetaUtils({ ...getTokensBySymbolForDevnet2(), ...registry }),
      )
    }

    return new TokenFactory(
      new TokenMetaUtils({ ...tokensBySymbol, ...registry }),
    )
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
          return getTokenFromMetaIncludingIbcBaseDenoms(bySymbol, denom)
        }

        const byAddress = this.tokenMetaUtils.getMetaByAddress(denom)

        if (byAddress) {
          return getTokenFromMeta(byAddress, denom)
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

  getPeggyDenomTokenMeta(denom: string): TokenMetaBase | undefined {
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

  getCw20DenomTokenMeta(address: string): TokenMetaBase | undefined {
    if (!isCw20ContractAddress(address)) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }

    return this.tokenMetaUtils.getMetaByAddress(address)
  }

  getIbcDenomTokenMeta(hash: string): TokenMetaBase | undefined {
    return this.tokenMetaUtils.getMetaByHash(hash)
  }

  getFactoryDenomTokenMeta(denom: string): TokenMetaBase | undefined {
    const [address] = denom.split('/').reverse()

    if (!address) {
      throw new GeneralException(
        new Error(`The address ${address} is not a valid CW20 address`),
      )
    }

    return isCw20ContractAddress(address)
      ? this.tokenMetaUtils.getMetaByAddress(address)
      : this.tokenMetaUtils.getMetaByFactory(denom)
  }
}
