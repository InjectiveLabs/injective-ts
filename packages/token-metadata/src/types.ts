import { ChainId } from '@injectivelabs/ts-types'

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  address: string
  addresses: { [key in ChainId]?: string }
}
