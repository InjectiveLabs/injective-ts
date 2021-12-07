import { TerraChainId } from './types'

export const TerraEndpoints = {
  [TerraChainId.Mainnet]: {
    rpc: 'https://tm.terra.injective.network',
    rest: 'https://lcd.terra.injective.network',
  },
} as Record<TerraChainId, { rpc: string; rest: string }>
