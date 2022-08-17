import { TokenMeta } from '../types'

export default {
  BTC: {
    name: 'Bitcoin',
    logo: 'bitcoin.svg',
    symbol: 'BTC',
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    coinGeckoId: 'bitcoin',
  },

  wBTC: {
    name: 'Wrapped Bitcoin',
    logo: 'wbtc.svg',
    symbol: 'wBTC',
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    coinGeckoId: 'wrapped-bitcoin',
  },

  WBTC: {
    name: 'Wrapped Bitcoin',
    logo: 'wbtc.svg',
    symbol: 'wBTC',
    decimals: 8,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    coinGeckoId: 'wrapped-bitcoin',
  },

  ETH: {
    name: 'Ethereum',
    logo: 'ethereum.svg',
    symbol: 'ETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    coinGeckoId: 'ethereum',
  },

  WETH: {
    name: 'Wrapped Ethereum',
    logo: 'ethereum.svg',
    symbol: 'wETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    coinGeckoId: 'ethereum',
  },

  wETH: {
    name: 'Wrapped Ethereum',
    logo: 'ethereum.svg',
    symbol: 'wETH',
    decimals: 18,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    coinGeckoId: 'ethereum',
  },

  INJ: {
    name: 'Injective',
    logo: 'injective-v3.svg',
    symbol: 'INJ',
    decimals: 18,
    address: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
    coinGeckoId: 'injective-protocol',
  },

  USDT: {
    name: 'Tether',
    logo: 'usdt.svg',
    symbol: 'USDT',
    decimals: 6,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    coinGeckoId: 'tether',
  },

  USDC: {
    name: 'USD Coin',
    logo: 'usdc.svg',
    symbol: 'USDC',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    coinGeckoId: 'usd-coin',
  },

  GRT: {
    name: 'Graph Token',
    logo: 'graphToken.svg',
    symbol: 'GRT',
    decimals: 18,
    address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    coinGeckoId: 'the-graph',
  },

  SNX: {
    name: 'Synthetix Network Token',
    logo: 'synthetix.svg',
    decimals: 18,
    symbol: 'SNX',
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    coinGeckoId: 'havven',
  },

  BNB: {
    name: 'Binance Coin',
    logo: 'bnb.svg',
    decimals: 18,
    symbol: 'BNB',
    address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    coinGeckoId: 'binancecoin',
  },

  AAVE: {
    name: 'Aave',
    logo: 'AAVE.svg',
    symbol: 'AAVE',
    decimals: 18,
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    coinGeckoId: 'aave',
  },

  YFI: {
    name: 'yearn.finance',
    logo: 'yfi.svg',
    symbol: 'YFI',
    decimals: 18,
    address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    coinGeckoId: 'yearn-finance',
  },

  COMP: {
    name: 'Compound',
    logo: 'comp.svg',
    symbol: 'COMP',
    decimals: 18,
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    coinGeckoId: 'compound-coin',
  },

  ZRX: {
    name: '0x',
    logo: 'zrx.svg',
    symbol: 'ZRX',
    decimals: 18,
    address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    coinGeckoId: '0x',
  },

  MATIC: {
    name: 'Polygon',
    logo: 'matic.svg',
    symbol: 'MATIC',
    decimals: 18,
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    coinGeckoId: 'matic-network',
  },

  UNI: {
    name: 'Uniswap',
    logo: 'uni.svg',
    symbol: 'UNI',
    decimals: 18,
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    coinGeckoId: 'uniswap',
  },

  DAI: {
    name: 'Dai',
    logo: 'dai.svg',
    symbol: 'DAI',
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    coinGeckoId: 'dai',
  },

  LINK: {
    name: 'Chainlink',
    logo: 'chainlink.svg',
    symbol: 'LINK',
    decimals: 18,
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    coinGeckoId: 'chainlink',
  },

  SUSHI: {
    name: 'SushiSwap',
    logo: 'sushi.svg',
    symbol: 'SUSHI',
    decimals: 18,
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    coinGeckoId: 'sushi',
  },

  AXS: {
    name: 'Axie Infinity',
    logo: 'axs.svg',
    symbol: 'AXS',
    decimals: 18,
    address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
    coinGeckoId: 'axie-infinity',
  },

  /* 20 Oct */
  '1INCH': {
    address: '0x111111111117dc0aa78b770fa6a738034120c302',
    coinGeckoId: '1inch',
    name: '1inch',
    symbol: '1INCH',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8104.png',
  },

  BAT: {
    address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    coinGeckoId: 'basic-attention-token',
    name: 'Basic Attention Token',
    symbol: 'BAT',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/1697.png',
  },

  BUSD: {
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    coinGeckoId: 'binance-usd',
    name: 'Binance USD',
    symbol: 'BUSD',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/4687.png',
  },

  CEL: {
    address: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
    coinGeckoId: 'celsius-degree-token',
    name: 'Celsius',
    symbol: 'CEL',
    decimals: 4,
    logo: 'https://static.alchemyapi.io/images/assets/2700.png',
  },

  CELL: {
    address: '0x26c8afbbfe1ebaca03c2bb082e69d0476bffe099',
    coinGeckoId: 'cellframe',
    name: 'Cellframe',
    symbol: 'CELL',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8992.png',
  },

  CHZ: {
    address: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
    coinGeckoId: 'chiliz',
    name: 'Chiliz',
    symbol: 'CHZ',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/4066.png',
  },

  DEFI5: {
    address: '0xfa6de2697d59e88ed7fc4dfe5a33dac43565ea41',
    coinGeckoId: 'defi-top-5-tokens-index',
    name: 'DEFI Top 5 Tokens Index',
    symbol: 'DEFI5',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8430.png',
  },

  ENJ: {
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    coinGeckoId: 'enjincoin',
    name: 'Enjin Coin',
    symbol: 'ENJ',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/2130.png',
  },

  EVAI: {
    address: '0x50f09629d0afdf40398a3f317cc676ca9132055c',
    coinGeckoId: 'evai',
    name: 'Evai.io',
    symbol: 'EVAI',
    decimals: 8,
    logo: 'https://static.alchemyapi.io/images/assets/9805.png',
  },

  FTM: {
    address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
    coinGeckoId: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/3513.png',
  },

  HT: {
    address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
    coinGeckoId: 'huobi-token',
    name: 'Huobi Token',
    symbol: 'HT',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/2502.png',
  },

  NEXO: {
    address: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
    coinGeckoId: 'nexo',
    name: 'Nexo',
    symbol: 'NEXO',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/2694.png',
  },

  NOIA: {
    address: '0xa8c8cfb141a3bb59fea1e2ea6b79b5ecbcd7b6ca',
    coinGeckoId: 'noia-network',
    name: 'Syntropy',
    symbol: 'NOIA',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/4191.png',
  },

  OCEAN: {
    address: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
    coinGeckoId: 'ocean-protocol',
    name: 'Ocean Protocol',
    symbol: 'OCEAN',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/3911.png',
  },

  PAXG: {
    address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
    coinGeckoId: 'pax-gold',
    name: 'PAX Gold',
    symbol: 'PAXG',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/4705.png',
  },

  POOL: {
    address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
    coinGeckoId: 'pooltogether',
    name: 'PoolTogether',
    symbol: 'POOL',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8508.png',
  },

  RUNE: {
    address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
    coinGeckoId: 'thorchain-erc20',
    name: 'THORChain (ERC20)',
    symbol: 'RUNE',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8272.png',
  },

  SHIB: {
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    coinGeckoId: 'shiba-inu',
    name: 'SHIBA INU',
    symbol: 'SHIB',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/5994.png',
  },

  STARS: {
    address: '0xc55c2175e90a46602fd42e931f62b3acc1a013ca',
    coinGeckoId: 'mogul-productions',
    name: 'Mogul Productions',
    symbol: 'STARS',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/8996.png',
  },

  STT: {
    address: '0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd',
    coinGeckoId: 'scatter-cx',
    name: 'Scatter.cx',
    symbol: 'STT',
    decimals: 18,
    logo: '',
  },

  SWAP: {
    address: '0xcc4304a31d09258b0029ea7fe63d032f52e44efe',
    coinGeckoId: 'trustswap',
    name: 'TrustSwap',
    symbol: 'SWAP',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/5829.png',
  },

  UMA: {
    address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
    coinGeckoId: 'uma',
    name: 'UMA',
    symbol: 'UMA',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/5617.png',
  },

  UTK: {
    address: '0xdc9ac3c20d1ed0b540df9b1fedc10039df13f99c',
    coinGeckoId: 'utrust',
    name: 'Utrust',
    symbol: 'UTK',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/2320.png',
  },

  /* 25 Oct */
  ATOM: {
    address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    coinGeckoId: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    decimals: 6,
    logo: 'atom.svg',
  },

  UATOM: {
    address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    coinGeckoId: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    decimals: 6,
    logo: 'atom.svg',
  },

  UPHOTON: {
    address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    coinGeckoId: 'cosmos',
    name: 'Cosmos Testnet',
    symbol: 'UPHOTON',
    decimals: 6,
    logo: 'atom.svg',
  },

  LUNA: {
    address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
    coinGeckoId: 'terra-luna',
    name: 'Terra',
    symbol: 'LUNA',
    decimals: 6,
    logo: 'luna.png',
  },

  ULUNA: {
    address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
    coinGeckoId: 'terra-luna',
    name: 'Terra',
    symbol: 'LUNA',
    decimals: 6,
    logo: 'luna.png',
  },

  UST: {
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    coinGeckoId: 'terrausd',
    name: 'TerraUSD',
    symbol: 'UST',
    decimals: 6,
    logo: 'ust.png',
  },

  UUSD: {
    address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    coinGeckoId: 'terrausd',
    name: 'TerraUSD',
    symbol: 'UST',
    decimals: 6,
    logo: 'ust.png',
  },

  GF: {
    address: '0xaaef88cea01475125522e117bfe45cf32044e238',
    coinGeckoId: 'guildfi',
    name: 'GuildFi',
    symbol: 'GF',
    decimals: 18,
    logo: 'gf.png',
  },

  XBX: {
    address: '0x080b12e80c9b45e97c23b6ad10a16b3e2a123949',
    coinGeckoId: '',
    name: 'BurnX',
    symbol: 'XBX',
    decimals: 18,
    logo: 'xbx.png',
  },

  OSMO: {
    address: '',
    coinGeckoId: 'osmosis',
    name: 'Osmosis',
    symbol: 'OSMO',
    decimals: 6,
    logo: 'osmo.png',
  },

  UOSMO: {
    address: '',
    coinGeckoId: 'osmosis',
    name: 'Osmosis',
    symbol: 'OSMO',
    decimals: 6,
    logo: 'osmo.png',
  },

  TAB: {
    name: 'Injective',
    logo: 'injective-v3.svg',
    symbol: 'TAB',
    decimals: 18,
    address: '0x36B3D7ACe7201E28040eFf30e815290D7b37ffaD',
    coinGeckoId: 'injective-protocol',
  },

  HUAHUA: {
    name: 'Chihuahua',
    logo: 'chihuahua.jpeg',
    symbol: 'HUAHUA',
    decimals: 6,
    address: '',
    coinGeckoId: 'chihuahua-token',
  },

  UHUAHUA: {
    name: 'Chihuahua',
    logo: 'chihuahua.jpeg',
    symbol: 'HUAHUA',
    decimals: 6,
    address: '',
    coinGeckoId: 'chihuahua-token',
  },

  JUNO: {
    name: 'Juno',
    logo: 'juno.jpeg',
    symbol: 'JUNO',
    decimals: 6,
    address: '',
    coinGeckoId: 'juno-network',
  },

  UJUNO: {
    name: 'Juno',
    logo: 'juno.jpeg',
    symbol: 'JUNO',
    decimals: 6,
    address: '',
    coinGeckoId: 'juno-network',
  },

  AXL: {
    name: 'Axelar',
    logo: 'axelar.jpeg',
    symbol: 'AXL',
    decimals: 6,
    address: '0x3eacbDC6C382ea22b78aCc158581A55aaF4ef3Cc',
    coinGeckoId: '',
  },

  UAXL: {
    name: 'Axelar',
    logo: 'axelar.jpeg',
    symbol: 'AXL',
    decimals: 6,
    address: '0x3eacbDC6C382ea22b78aCc158581A55aaF4ef3Cc',
    coinGeckoId: '',
  },

  BAYC: {
    name: 'Bored Ape Yacht Club',
    logo: 'bayc.svg',
    symbol: 'BAYC',
    decimals: 18,
    address: '',
    coinGeckoId: '',
  },

  /** 18.03.2022 */
  APE: {
    name: 'Ape Coin',
    logo: 'ape.png',
    symbol: 'APE',
    decimals: 18,
    address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    coinGeckoId: 'apecoin',
  },

  USCRT: {
    name: 'Secret Network',
    logo: 'scrt.png',
    symbol: 'SCRT',
    decimals: 6,
    address: '',
    coinGeckoId: 'secret',
  },

  SCRT: {
    name: 'Secret Network',
    logo: 'scrt.png',
    symbol: 'SCRT',
    decimals: 6,
    address: '',
    coinGeckoId: 'secret',
  },

  XPRT: {
    name: 'Persistence',
    logo: 'xprt.svg',
    symbol: 'XPRT',
    decimals: 6,
    address: '',
    coinGeckoId: 'persistence',
  },

  UXPRT: {
    name: 'Persistence',
    logo: 'xprt.svg',
    symbol: 'XPRT',
    decimals: 6,
    address: '',
    coinGeckoId: 'persistence',
  },

  EVMOS: {
    name: 'Evmos',
    logo: 'evmos.svg',
    symbol: 'EVMOS',
    decimals: 18,
    address: '',
    coinGeckoId: 'evmos',
  },

  AEVMOS: {
    name: 'Evmos',
    logo: 'evmos.svg',
    symbol: 'EVMOS',
    decimals: 18,
    address: '',
    coinGeckoId: 'evmos',
  },

  UAEVMOS: {
    name: 'Evmos',
    logo: 'evmos.svg',
    symbol: 'EVMOS',
    decimals: 18,
    address: '',
    coinGeckoId: 'evmos',
  },

  STX: {
    name: 'Stacks',
    logo: 'stacks.png',
    symbol: 'STX',
    decimals: 6,
    address: '',
    coinGeckoId: 'blockstack',
  },
  DOT: {
    name: 'Polkadot',
    logo: 'dot.jpeg',
    symbol: 'DOT',
    decimals: 10,
    address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
    coinGeckoId: 'polkadot',
  },
  'DOT-PLANCK': {
    name: 'Polkadot',
    logo: 'dot.jpeg',
    symbol: 'DOT',
    decimals: 10,
    address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
    coinGeckoId: 'polkadot',
  },
} as Record<string, TokenMeta>
