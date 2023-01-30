import {
  TokenMetaUtilFactory,
  TokenMetaUtil,
  TokenMeta,
  IbcToken,
  Token,
  ibcTokens,
} from '@injectivelabs/token-metadata'
import { INJ_DENOM } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { GeneralException, ErrorType } from '@injectivelabs/exceptions'
import { DenomTrace } from '@injectivelabs/core-proto-ts/ibc/applications/transfer/v1/transfer'
import { checkIsIbcDenomCanonical, tokenMetaToToken } from './utils'

/**
 * This client can be used to fetch token
 * denoms in a fully sync way (without calling external APIs)
 *
 * @category Utility Classes
 */
export class DenomClient {
  protected cachedDenomTraces: Record<string, DenomTrace> = {}

  protected tokenMetaUtil: TokenMetaUtil

  constructor(network: Network = Network.Mainnet) {
    this.cachedDenomTraces = Object.keys(ibcTokens).reduce(
      (cachedDenomTraces, ibcTokenKey) => ({
        ...cachedDenomTraces,
        [ibcTokenKey.toString()]: ibcTokens[
          ibcTokenKey as unknown as string as keyof typeof ibcTokens
        ] as DenomTrace,
      }),
      {},
    )
    this.tokenMetaUtil = TokenMetaUtilFactory.make(network)
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

  getIbcDenomToken(denom: string): IbcToken {
    const { baseDenom, path } = this.fetchDenomTrace(denom)
    const tokenMeta = this.getDenomToken(baseDenom)

    return {
      baseDenom,
      isCanonical: checkIsIbcDenomCanonical(path),
      channelId: path.replace('transfer/', ''),
      ...tokenMetaToToken(tokenMeta, denom),
    } as IbcToken
  }

  getDenomToken(denom: string): Token | undefined {
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
      const tokenMeta = this.getDenomTokenMeta(denom)

      return tokenMetaToToken(tokenMeta, denom) as Token
    } catch (e) {
      return
    }
  }

  getDenomTokenThrow(denom: string): Token {
    const tokenMeta = this.getDenomToken(denom)

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

  fetchDenomTrace(denom: string) {
    const denomTrace = this.cachedDenomTraces[denom.replace('ibc/', '')]

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

  private getIbcDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this
    const { baseDenom: symbol } = this.fetchDenomTrace(denom)

    return tokenMetaUtil.getMetaBySymbol(symbol)
  }

  private getFactoryDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    const [, , address] = denom.split('/')

    return tokenMetaUtil.getMetaByAddress(address)
  }

  private getDenomTokenMeta(denom: string): TokenMeta | undefined {
    const { tokenMetaUtil } = this

    if (denom === INJ_DENOM) {
      return tokenMetaUtil.getMetaBySymbol('INJ')
    }

    if (denom.startsWith('ibc/')) {
      return this.getIbcDenomTokenMeta(denom)
    }

    if (denom.startsWith('factory/')) {
      return this.getFactoryDenomTokenMeta(denom)
    }

    return this.getPeggyDenomTokenMeta(denom)
  }
}
