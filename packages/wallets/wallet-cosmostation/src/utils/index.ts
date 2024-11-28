import { Cosmos } from '@cosmostation/extension-client'

export const isCosmosStationWalletInstalled = () => {
  const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
    cosmostation?: Cosmos
  }

  return $window.cosmostation !== undefined
}
