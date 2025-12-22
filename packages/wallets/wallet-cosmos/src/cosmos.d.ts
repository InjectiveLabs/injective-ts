import type { Window as KeplrWindow } from '@keplr-wallet/types'

/**
 * Cosmostation vanilla API for cosmos namespace.
 * Used for cos_supportedChainIds which is not available via Keplr interface.
 */
export interface CosmostationCosmos {
  request<T>(message: { method: string; params?: unknown }): Promise<T>
  on(eventName: string, handler: () => void): void
  off(eventName: string, handler: () => void): void
}

/**
 * Cosmostation provider interface available on window.cosmostation.
 * Exposes both vanilla cosmos API and Keplr-compatible interface.
 */
export interface CosmostationProvider {
  cosmos: CosmostationCosmos
  providers?: {
    keplr?: KeplrWindow['keplr']
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    leap: KeplrWindow['keplr']
    keplr: KeplrWindow['keplr']
    ninji: KeplrWindow['ninji']
    owallet?: KeplrWindow['owallet']
    cosmostation?: CosmostationProvider
  }
}
