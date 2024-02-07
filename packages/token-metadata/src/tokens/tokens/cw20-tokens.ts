import { TokenMetaBase } from '../../types'

/** for testnet purposes only */
export default {
  ZEN: {
    name: 'ZEN',
    logo: 'zen.svg',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'ZEN',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        decimals: 18,
      },
    ],
  },

  UZEN: {
    name: 'ZEN',
    logo: 'zen.svg',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'ZEN',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        decimals: 18,
      },
    ],
  },

  PROJ: {
    name: 'PROJ',
    decimals: 18,
    symbol: 'PROJ',
    coinGeckoId: '',
    logo: 'proj.png',

    tokenFactories: [
      {
        symbol: 'PROJ',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        decimals: 18,
      },
    ],
  },

  PROJX: {
    name: 'PROJX',
    logo: 'projx.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'PROJX',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        decimals: 18,
      },
    ],
  },

  DEMO: {
    name: 'Demo Coin',
    logo: 'injective-v3.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'DEMO',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        decimals: 18,
      },
    ],
  },

  MITOTEST2: {
    name: 'Mito test token',
    logo: 'mito-test.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        decimals: 6,
        symbol: 'MT',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
      },
    ],
  },
} as Record<string, TokenMetaBase>
