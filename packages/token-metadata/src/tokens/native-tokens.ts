import { TokenMeta } from '../types'

export default {
  nativeSOL: {
    name: 'Solana',
    logo: 'solana.svg',
    symbol: 'SOL',
    decimals: 9,
    address: 'native-sol',
    coinGeckoId: 'solana',
  },
} as Record<string, TokenMeta>
