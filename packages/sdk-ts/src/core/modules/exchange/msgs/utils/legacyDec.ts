import { toChainFormat } from '@injectivelabs/utils'

/** params are human-readable, the proto stores LegacyDec (the value scaled by 1e18) */
export const toLegacyDec = (value?: string) =>
  toChainFormat(value || '0').toFixed()
