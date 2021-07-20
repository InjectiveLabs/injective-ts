import { ChainId } from '@injectivelabs/ts-types'

export default {
  BTC: {
    name: 'Bitcoin',
    logo: 'bitcoin.svg',
    symbol: 'BTC',
    decimals: 18,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    addresses: {
      [ChainId.Mainnet]: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    },
  },

  ETH: {
    name: 'Ethereum',
    logo: 'ethereum.svg',
    symbol: 'ETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    addresses: {
      [ChainId.Mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  },

  WETH: {
    name: 'Wrapped Ethereum',
    logo: 'ethereum.svg',
    symbol: 'wETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    addresses: {
      [ChainId.Mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  },

  INJ: {
    name: 'Injective',
    logo: 'injective.svg',
    symbol: 'INJ',
    decimals: 18,
    address: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
    addresses: {
      [ChainId.Mainnet]: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
      [ChainId.Kovan]: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
    },
  },

  USDT: {
    name: 'USDT',
    logo: 'usdt.svg',
    symbol: 'USDT',
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    addresses: {
      [ChainId.Mainnet]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainId.Kovan]: '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08',
    },
  },

  USDC: {
    name: 'USDC',
    logo: 'usdc.svg',
    symbol: 'USDC',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    addresses: {
      [ChainId.Mainnet]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainId.Kovan]: '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08',
    },
  },

  GRT: {
    name: 'Graph Token',
    logo: 'graphToken.svg',
    symbol: 'GRT',
    decimals: 18,
    address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    addresses: {
      [ChainId.Mainnet]: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    },
  },

  SNX: {
    name: 'Synthetix Network Token',
    logo: 'synthetix.svg',
    decimals: 18,
    symbol: 'SNX',
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    addresses: {
      [ChainId.Mainnet]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    },
  },

  BNB: {
    name: 'Binance Coin',
    logo: 'bnb.svg',
    decimals: 18,
    symbol: 'BNB',
    address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    addresses: {
      [ChainId.Mainnet]: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
      [ChainId.Kovan]: '0xf833cad2b46b49ef96244b974aaff8b80ff84fdd',
    },
  },

  AAVE: {
    name: 'Aave',
    logo: 'AAVE.svg',
    symbol: 'AAVE',
    decimals: 18,
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    addresses: {
      [ChainId.Mainnet]: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      [ChainId.Kovan]: '0x69BeD9289Eb970F021BA86fec646f9C427E0320A',
    },
  },

  YFI: {
    name: 'yearn.finance',
    logo: 'yfi.svg',
    symbol: 'YFI',
    decimals: 18,
    address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    addresses: {
      [ChainId.Mainnet]: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      [ChainId.Kovan]: '0x6acd36eb845a8f905512d5f259c1233242349266',
    },
  },

  COMP: {
    name: 'Compound',
    logo: 'comp.svg',
    symbol: 'COMP',
    decimals: 18,
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    addresses: {
      [ChainId.Mainnet]: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    },
  },

  ZRX: {
    name: '0x',
    logo: 'zrx.svg',
    symbol: 'ZRX',
    decimals: 18,
    address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    addresses: {
      [ChainId.Mainnet]: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      [ChainId.Kovan]: '0xb4ef9d74108980fece40d9205c3d1c94090a3b50',
    },
  },

  MATIC: {
    name: 'Polygon',
    logo: 'matic.svg',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    addresses: {
      [ChainId.Mainnet]: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      [ChainId.Kovan]: '0x724d7e46bf2cc15de3932f547a60018c286312a7',
    },
  },

  UNI: {
    name: 'Uniswap',
    logo: 'uni.svg',
    symbol: 'UNI',
    decimals: 18,
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    addresses: {
      [ChainId.Mainnet]: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      [ChainId.Kovan]: '0x138b989687da853a561D4edE88D8281434211780',
    },
  },

  DAI: {
    name: 'Dai',
    logo: 'dai.svg',
    symbol: 'DAI',
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    addresses: {
      [ChainId.Mainnet]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [ChainId.Kovan]: '0x138b989687da853a561D4edE88D8281434211780',
    },
  },

  LINK: {
    name: 'Chainlink',
    logo: 'chainlink.svg',
    symbol: 'LINK',
    decimals: 18,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    addresses: {
      [ChainId.Mainnet]: '0x514910771af9ca656af840dff83e8264ecf986ca',
      [ChainId.Kovan]: '0xc843f43093f8d32c01a065ed2a0a34fb54baaf3f',
    },
  },

  SUSHI: {
    name: 'SushiSwap',
    logo: 'sushi.svg',
    symbol: 'SUSHI',
    decimals: 18,
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    addresses: {
      [ChainId.Mainnet]: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    },
  },
}
