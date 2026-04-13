import type { CosmostationProvider } from './../types.js'

export const isCosmosStationWalletInstalled = () => {
  const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
    cosmostation?: CosmostationProvider
  }

  return $window.cosmostation !== undefined
}
