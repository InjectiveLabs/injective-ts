import { toChainFormat } from '@injectivelabs/utils'

export const toLegacyDec = (value?: string) =>
  toChainFormat(value || '0').toFixed()
