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

  TEST1: {
    name: 'Test 1',
    logo: 'mito-test.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        decimals: 6,
        symbol: 'TEST1',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
      },
    ],
  },

  TEST2: {
    name: 'Test 2',
    logo: 'mito-test.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        decimals: 6,
        symbol: 'TEST2',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
      },
    ],
  },

  TEST3: {
    name: 'Test 3',
    logo: 'mito-test.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        decimals: 6,
        symbol: 'TEST3',
        creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
      },
    ],
  },

  PHUC: {
    name: 'Phuc',
    logo: 'mito-test.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
        symbol: 'PHUC',
        decimals: 6,
      },
    ],
  },
} as Record<string, TokenMetaBase>
