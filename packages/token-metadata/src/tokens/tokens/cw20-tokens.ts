import { TokenMetaBase, TokenType } from '../../types'

/** for testnet purposes only */
export default {
  'INJ-MASTER': {
    name: 'INJ Master',
    logo: 'mito-inj-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'INJ-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'INJ-BOOST': {
    name: 'INJ Boost',
    logo: 'mito-inj-boost-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'INJ-BOOST-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'XAU-BOOST': {
    name: 'XAU Boost',
    logo: 'mito-xau-boost-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'XAU-BOOST-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'WETH-MASTER': {
    name: 'WETH Master',
    logo: 'mito-weth-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'WETH-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'ETH-BOOST': {
    name: 'ETH Boost',
    logo: 'mito-eth-boost-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'ETH-boost-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'ATOM-MASTER': {
    name: 'ATOM Master',
    logo: 'mito-atom-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'ATOM-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'ATOM-BOOST': {
    name: 'ATOM Boost',
    logo: 'mito-atom-boost-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'ATOM-BOOST-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'USDC-MASTER': {
    name: 'USDC Master',
    logo: 'mito-usdc-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'USDC-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'PROJ-MASTER': {
    name: 'PROJ Master',
    logo: 'mito-proj-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'PROJ-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'GBP-MASTER': {
    name: 'GBP Master',
    logo: 'mito-gbp-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'GBP-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'EUR-MASTER': {
    name: 'EUR Master',
    logo: 'mito-eur-master-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'EUR-MASTER-LP',
      tokenType: TokenType.Cw20,
    },
  },

  'STINJ-BOOST': {
    name: 'stINJ Boost',
    logo: 'mito-stInj-boost-lp.png',
    coinGeckoId: '',

    cw20: {
      decimals: 18,
      address: '',
      symbol: 'stINJ-BOOST-LP',
      tokenType: TokenType.Cw20,
    },
  },

  ZEN: {
    name: 'ZEN',
    logo: 'zen.svg',
    coinGeckoId: '',

    cw20: {
      symbol: 'ZEN',
      decimals: 18,
      address: 'uzen',
      tokenType: TokenType.Cw20,
    },
  },

  PROJ: {
    name: 'PROJ',
    logo: 'proj.png',
    coinGeckoId: '',

    cw20: {
      symbol: 'PROJ',
      decimals: 18,
      address: 'proj',
      tokenType: TokenType.Cw20,
    },
  },

  PROJX: {
    name: 'PROJX',
    logo: 'projx.png',
    coinGeckoId: '',

    cw20: {
      symbol: 'PROJX',
      decimals: 18,
      address: 'projx',
      tokenType: TokenType.Cw20,
    },
  },

  DEMO: {
    name: 'Demo Coin',
    logo: 'injective-v3.png',
    coinGeckoId: '',

    cw20: {
      symbol: 'DEMO',
      decimals: 18,
      address: 'demo',
      tokenType: TokenType.Cw20,
    },
  },
} as Record<string, TokenMetaBase>
