import { Network } from '@injectivelabs/networks'
import { Denom } from '@injectivelabs/sdk-ts'
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
        return denomTraceFromCache
      }
    }

    return await new Denom(denom, network).getDenomToken()
  }

  async getIbcDenomToken(denom: string) {
    const { network } = this

    if (denom.startsWith('ibc/')) {
      const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

      if (denomTraceFromCache) {
        return denomTraceFromCache
      }
    }

    return await new Denom(denom, network).getIbcDenomToken()
  }

  async getPeggyDenomToken(denom: string) {
    const { network } = this

    if (denom.startsWith('ibc/')) {
      const denomTraceFromCache = await this.fetchDenomTraceFromCache(denom)

      if (denomTraceFromCache) {
        return denomTraceFromCache
      }
    }

    return await new Denom(denom, network).getPeggyDenomToken()
  }

  private async fetchDenomTraceFromCache(denom: string) {
    return this.cachedDenomTraces[denom.replace('ibc/', '')]
  }
}
