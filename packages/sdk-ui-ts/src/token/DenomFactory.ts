import { Network } from '@injectivelabs/networks'
import { Denom, tokenMetaToToken } from '@injectivelabs/sdk-ts'
import { ibcTokens } from '@injectivelabs/token-metadata'
import { DenomTrace } from '../types/token'

export class DenomFactory {
  network: Network

  protected cachedDenomTraces: Record<string, DenomTrace> = {}

  constructor(network: Network = Network.Mainnet) {
    this.network = network
    this.cachedDenomTraces = Object.keys(ibcTokens).reduce(
      (cachedDenomTraces, ibcTokenKey) => ({
        ...cachedDenomTraces,
        [ibcTokenKey.toString()]: ibcTokens[
          ibcTokenKey as unknown as string as keyof typeof ibcTokens
        ] as DenomTrace,
      }),
      {},
    )
  }

  async getDenomToken(denom: string) {
    const { network } = this

    if (denom.startsWith('ibc/')) {
      const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

      if (denomTraceFromCache) {
        const tokenMeta = await new Denom(
          denomTraceFromCache.baseDenom,
        ).getTokenMetaDataBySymbol()

        return tokenMetaToToken(tokenMeta, denom)
      }
    }

    return await new Denom(denom, network).getDenomToken()
  }

  async getDenomTrace(denom: string) {
    if (!denom.startsWith('ibc/')) {
      throw new Error(`${denom} is not an IBC denom`)
    }

    const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

    if (denomTraceFromCache) {
      return denomTraceFromCache
    }

    const { baseDenom, path } = await new Denom(
      denom,
      this.network,
    ).fetchDenomTrace()

    return {
      path,
      baseDenom,
    }
  }

  private async fetchDenomTraceFromCache(denom: string) {
    return this.cachedDenomTraces[denom.replace('ibc/', '')]
  }
}
