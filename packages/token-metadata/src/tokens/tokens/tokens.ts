import { TokenMeta, Cw20TokenSource, TokenType } from '../../types'

export default {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    logo: 'bitcoin.svg',
    coinGeckoId: 'bitcoin',

    erc20: {
      decimals: 8,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      tokenType: TokenType.Erc20,
    },
  },

  wBTC: {
    name: 'Wrapped Bitcoin',
    symbol: 'wBTC',
    decimals: 8,
    logo: 'wbtc.svg',
    coinGeckoId: 'wrapped-bitcoin',

    erc20: {
      decimals: 8,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      tokenType: TokenType.Erc20,
    },
  },

  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logo: 'ethereum.svg',
    coinGeckoId: 'ethereum',

    erc20: {
      decimals: 18,
      isNative: true,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      tokenType: TokenType.Erc20,
    },
  },

  wETH: {
    name: 'Wrapped Ethereum',
    symbol: 'wETH',
    decimals: 18,
    logo: 'ethereum.svg',
    coinGeckoId: 'ethereum',

    erc20: {
      decimals: 18,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      tokenType: TokenType.Erc20,
    },
  },

  INJ: {
    name: 'Injective',
    symbol: 'INJ',
    decimals: 18,
    logo: 'injective-v3.svg',
    coinGeckoId: 'injective-protocol',

    erc20: {
      decimals: 18,
      address: '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
      tokenType: TokenType.Erc20,
    },
  },

  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
    logo: 'usdt.svg',
    coinGeckoId: 'tether',

    erc20: {
      decimals: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      tokenType: TokenType.Erc20,
    },
  },

  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: 'usdc.svg',
    coinGeckoId: 'usd-coin',

    erc20: {
      decimals: 6,
      symbol: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        decimals: 6,
        symbol: 'USDCet',
        source: Cw20TokenSource.EthereumWh,
        address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDCso',
        source: Cw20TokenSource.Solana,
        address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  GRT: {
    name: 'Graph Token',
    symbol: 'GRT',
    decimals: 18,
    logo: 'graphToken.svg',
    coinGeckoId: 'the-graph',

    erc20: {
      decimals: 18,
      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      tokenType: TokenType.Erc20,
    },
  },

  SNX: {
    name: 'Synthetix Network Token',
    symbol: 'SNX',
    decimals: 18,
    logo: 'synthetix.svg',
    coinGeckoId: 'havven',

    erc20: {
      decimals: 18,
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      tokenType: TokenType.Erc20,
    },
  },

  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
    logo: 'bnb.svg',
    coinGeckoId: 'binancecoin',

    erc20: {
      decimals: 18,
      address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
      tokenType: TokenType.Erc20,
    },
  },

  AAVE: {
    name: 'Aave',
    symbol: 'AAVE',
    decimals: 18,
    logo: 'AAVE.svg',
    coinGeckoId: 'aave',

    erc20: {
      decimals: 18,
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      tokenType: TokenType.Erc20,
    },
  },

  YFI: {
    name: 'yearn.finance',
    symbol: 'YFI',
    logo: 'yfi.svg',
    decimals: 18,
    coinGeckoId: 'yearn-finance',

    erc20: {
      decimals: 18,
      address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      tokenType: TokenType.Erc20,
    },
  },

  COMP: {
    name: 'Compound',
    symbol: 'COMP',
    decimals: 18,
    logo: 'comp.svg',
    coinGeckoId: 'compound-coin',

    erc20: {
      decimals: 18,
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      tokenType: TokenType.Erc20,
    },
  },

  ZRX: {
    name: '0x',
    symbol: 'ZRX',
    decimals: 18,
    logo: 'zrx.svg',
    coinGeckoId: '0x',

    erc20: {
      decimals: 18,
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      tokenType: TokenType.Erc20,
    },
  },

  MATIC: {
    name: 'Polygon',
    logo: 'matic.svg',
    symbol: 'MATIC',
    decimals: 18,
    coinGeckoId: 'matic-network',

    erc20: {
      decimals: 18,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      tokenType: TokenType.Erc20,
    },
  },

  UNI: {
    name: 'Uniswap',
    symbol: 'UNI',
    logo: 'uni.svg',
    decimals: 18,
    coinGeckoId: 'uniswap',

    erc20: {
      decimals: 18,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      tokenType: TokenType.Erc20,
    },
  },

  DAI: {
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    logo: 'dai.svg',
    coinGeckoId: 'dai',

    erc20: {
      decimals: 18,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      tokenType: TokenType.Erc20,
    },
  },

  LINK: {
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    logo: 'chainlink.svg',
    coinGeckoId: 'chainlink',

    erc20: {
      decimals: 18,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      tokenType: TokenType.Erc20,
    },
  },

  SUSHI: {
    name: 'SushiSwap',
    symbol: 'SUSHI',
    decimals: 18,
    logo: 'sushi.svg',
    coinGeckoId: 'sushi',

    erc20: {
      decimals: 18,
      address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      tokenType: TokenType.Erc20,
    },
  },

  AXS: {
    name: 'Axie Infinity',
    symbol: 'AXS',
    decimals: 18,
    logo: 'axs.png',
    coinGeckoId: 'axie-infinity',

    erc20: {
      decimals: 18,
      address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
      tokenType: TokenType.Erc20,
    },
  },

  /* 20 Oct */
  '1INCH': {
    name: '1inch',
    symbol: '1INCH',
    decimals: 18,
    logo: '1inch.png',
    coinGeckoId: '1inch',

    erc20: {
      decimals: 18,
      address: '0x111111111117dc0aa78b770fa6a738034120c302',
      tokenType: TokenType.Erc20,
    },
  },

  BAT: {
    name: 'Basic Attention Token',
    symbol: 'BAT',
    decimals: 18,
    logo: 'bat.png',
    coinGeckoId: 'basic-attention-token',

    erc20: {
      decimals: 18,
      address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
      tokenType: TokenType.Erc20,
    },
  },

  BUSD: {
    name: 'Binance USD',
    symbol: 'BUSD',
    decimals: 18,
    logo: 'busd.png',
    coinGeckoId: 'binance-usd',

    erc20: {
      decimals: 18,
      address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
      tokenType: TokenType.Erc20,
    },
  },

  CEL: {
    name: 'Celsius',
    symbol: 'CEL',
    decimals: 4,
    logo: 'cel.png',
    coinGeckoId: 'celsius-degree-token',

    erc20: {
      decimals: 4,
      address: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
      tokenType: TokenType.Erc20,
    },
  },

  CELL: {
    name: 'Cellframe',
    symbol: 'CELL',
    decimals: 18,
    logo: 'cell.png',
    coinGeckoId: 'cellframe',

    erc20: {
      decimals: 18,
      address: '0x26c8afbbfe1ebaca03c2bb082e69d0476bffe099',
      tokenType: TokenType.Erc20,
    },
  },

  DEFI5: {
    name: 'DEFI Top 5 Tokens Index',
    symbol: 'DEFI5',
    decimals: 18,
    logo: 'defi5.png',
    coinGeckoId: 'defi-top-5-tokens-index',

    erc20: {
      decimals: 18,
      address: '0xfa6de2697d59e88ed7fc4dfe5a33dac43565ea41',
      tokenType: TokenType.Erc20,
    },
  },

  ENJ: {
    name: 'Enjin Coin',
    symbol: 'ENJ',
    decimals: 18,
    logo: 'enj.png',
    coinGeckoId: 'enjincoin',

    erc20: {
      decimals: 18,
      address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
      tokenType: TokenType.Erc20,
    },
  },

  EVAI: {
    name: 'Evai.io',
    symbol: 'EVAI',
    decimals: 8,
    logo: 'evai.png',
    coinGeckoId: 'evai',

    erc20: {
      decimals: 8,
      address: '0x50f09629d0afdf40398a3f317cc676ca9132055c',
      tokenType: TokenType.Erc20,
    },
  },

  FTM: {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    logo: 'ftm.png',
    coinGeckoId: 'fantom',

    erc20: {
      decimals: 18,
      address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
      tokenType: TokenType.Erc20,
    },
  },

  HT: {
    name: 'Huobi Token',
    symbol: 'HT',
    decimals: 18,
    logo: 'ht.png',
    coinGeckoId: 'huobi-token',

    erc20: {
      decimals: 18,
      address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
      tokenType: TokenType.Erc20,
    },
  },

  NEXO: {
    name: 'Nexo',
    symbol: 'NEXO',
    decimals: 18,
    logo: 'nexo.png',
    coinGeckoId: 'nexo',

    erc20: {
      decimals: 18,
      address: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
      tokenType: TokenType.Erc20,
    },
  },

  NOIA: {
    name: 'Syntropy',
    symbol: 'NOIA',
    decimals: 18,
    logo: 'noia.png',
    coinGeckoId: 'noia-network',

    erc20: {
      decimals: 18,
      address: '0xa8c8cfb141a3bb59fea1e2ea6b79b5ecbcd7b6ca',
      tokenType: TokenType.Erc20,
    },
  },

  OCEAN: {
    name: 'Ocean Protocol',
    symbol: 'OCEAN',
    decimals: 18,
    logo: 'ocean.png',
    coinGeckoId: 'ocean-protocol',

    erc20: {
      decimals: 18,
      address: '0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
      tokenType: TokenType.Erc20,
    },
  },

  PAXG: {
    name: 'PAX Gold',
    symbol: 'PAXG',
    decimals: 18,
    logo: 'paxg.png',
    coinGeckoId: 'pax-gold',

    erc20: {
      decimals: 18,
      address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
      tokenType: TokenType.Erc20,
    },
  },

  POOL: {
    name: 'PoolTogether',
    symbol: 'POOL',
    decimals: 18,
    logo: 'pool.png',
    coinGeckoId: 'pooltogether',

    erc20: {
      decimals: 18,
      address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
      tokenType: TokenType.Erc20,
    },
  },

  RUNE: {
    name: 'THORChain (ERC20)',
    symbol: 'RUNE',
    decimals: 18,
    logo: 'rune.png',
    coinGeckoId: 'thorchain-erc20',

    erc20: {
      decimals: 18,
      address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
      tokenType: TokenType.Erc20,
    },
  },

  SHIB: {
    name: 'SHIBA INU',
    symbol: 'SHIB',
    decimals: 18,
    logo: 'shib.png',
    coinGeckoId: 'shiba-inu',

    erc20: {
      decimals: 18,
      address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      tokenType: TokenType.Erc20,
    },
  },

  STARS: {
    name: 'Mogul Productions',
    symbol: 'STARS',
    decimals: 18,
    logo: 'stars.png',
    coinGeckoId: 'mogul-productions',

    erc20: {
      decimals: 18,
      address: '0xc55c2175e90a46602fd42e931f62b3acc1a013ca',
      tokenType: TokenType.Erc20,
    },
  },

  STT: {
    name: 'Scatter.cx',
    symbol: 'STT',
    decimals: 18,
    logo: 'injective-v3.svg',
    coinGeckoId: 'scatter-cx',

    erc20: {
      decimals: 18,
      address: '0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd',
      tokenType: TokenType.Erc20,
    },
  },

  SWAP: {
    name: 'TrustSwap',
    symbol: 'SWAP',
    decimals: 18,
    logo: 'https://static.alchemyapi.io/images/assets/5829.png',
    coinGeckoId: 'trustswap',

    erc20: {
      decimals: 18,
      address: '0xcc4304a31d09258b0029ea7fe63d032f52e44efe',
      tokenType: TokenType.Erc20,
    },
  },

  UMA: {
    name: 'UMA',
    symbol: 'UMA',
    decimals: 18,
    coinGeckoId: 'uma',
    logo: 'uma.png',

    erc20: {
      decimals: 18,
      address: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
      tokenType: TokenType.Erc20,
    },
  },

  UTK: {
    name: 'Utrust',
    symbol: 'UTK',
    decimals: 18,
    logo: 'utk.png',
    coinGeckoId: 'utrust',

    erc20: {
      decimals: 18,
      address: '0xdc9ac3c20d1ed0b540df9b1fedc10039df13f99c',
      tokenType: TokenType.Erc20,
    },
  },

  ATOM: {
    name: 'Cosmos',
    symbol: 'ATOM',
    decimals: 6,
    logo: 'atom.svg',
    coinGeckoId: 'cosmos',

    erc20: {
      decimals: 6,
      address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uatom',
        path: 'transfer/channel-1',
        channelId: 'channel-1',
        hash: '624ba9dd171915a2b9ea70f69638b2cea179959850c1a586f6c485498f29edd4',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  UPHOTON: {
    name: 'Cosmos Testnet',
    symbol: 'UPHOTON',
    decimals: 6,
    logo: 'atom.svg',
    coinGeckoId: 'cosmos',

    erc20: {
      decimals: 6,
      address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uphoton',
        path: 'transfer/channel-2',
        channelId: 'channel-2',
        hash: '48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  LUNA: {
    name: 'Terra',
    symbol: 'LUNA',
    decimals: 6,
    logo: 'luna.png',
    coinGeckoId: 'terra-luna',

    erc20: {
      decimals: 6,
      address: '0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uluna',
        path: 'transfer/channel-4',
        channelId: 'channel-4',
        hash: 'B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  UST: {
    name: 'TerraUSD',
    baseDenom: 'UUSD',
    symbol: 'UST',
    logo: 'ust.png',
    decimals: 18,
    coinGeckoId: 'terrausd',

    erc20: {
      decimals: 18,
      address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 18,
        isNative: true,
        baseDenom: 'uusd',
        path: 'transfer/channel-4',
        channelId: 'channel-4',
        hash: 'B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  GF: {
    name: 'GuildFi',
    symbol: 'GF',
    decimals: 18,
    logo: 'gf.png',
    coinGeckoId: 'guildfi',

    erc20: {
      decimals: 18,
      address: '0xaaef88cea01475125522e117bfe45cf32044e238',
      tokenType: TokenType.Erc20,
    },
  },

  XBX: {
    name: 'BurnX',
    symbol: 'XBX',
    decimals: 18,
    logo: 'xbx.png',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      address: '0x080b12e80c9b45e97c23b6ad10a16b3e2a123949',
      tokenType: TokenType.Erc20,
    },
  },

  OSMO: {
    name: 'Osmosis',
    symbol: 'OSMO',
    decimals: 6,
    coinGeckoId: 'osmosis',
    logo: 'osmo.png',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uosmo',
        path: 'transfer/channel-8',
        channelId: 'channel-8',
        hash: '92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  TAB: {
    name: 'Injective',
    logo: 'injective-v3.svg',
    symbol: 'TAB',
    decimals: 18,
    coinGeckoId: 'injective-protocol',

    erc20: {
      decimals: 18,
      address: '0x36B3D7ACe7201E28040eFf30e815290D7b37ffaD',
      tokenType: TokenType.Erc20,
    },
  },

  HUAHUA: {
    name: 'Chihuahua',
    symbol: 'HUAHUA',
    decimals: 6,
    logo: 'chihuahua.jpeg',
    coinGeckoId: 'chihuahua-token',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uhuahua',
        path: 'transfer/channel-76',
        channelId: 'channel-76',
        hash: 'E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  JUNO: {
    name: 'Juno',
    symbol: 'JUNO',
    decimals: 6,
    logo: 'juno.jpeg',
    coinGeckoId: 'juno-network',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'ujuno',
        path: 'transfer/channel-78',
        channelId: 'channel-78',
        hash: 'D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  AXL: {
    name: 'Axelar',
    logo: 'axelar.jpeg',
    symbol: 'AXL',
    decimals: 6,
    coinGeckoId: 'axelar',

    erc20: {
      decimals: 6,
      address: '0x3eacbDC6C382ea22b78aCc158581A55aaF4ef3Cc',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uaxl',
        path: 'transfer/channel-84',
        channelId: 'channel-84',
        hash: 'B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  BAYC: {
    name: 'Bored Ape Yacht Club',
    symbol: 'BAYC',
    logo: 'bayc.svg',
    decimals: 18,
    coinGeckoId: '',
  },

  /** 18.03.2022 */
  APE: {
    name: 'Ape Coin',
    symbol: 'APE',
    decimals: 18,
    logo: 'ape.png',
    coinGeckoId: 'apecoin',

    erc20: {
      decimals: 18,
      address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
      tokenType: TokenType.Erc20,
    },
  },

  SCRT: {
    name: 'Secret Network',
    symbol: 'SCRT',
    decimals: 6,
    logo: 'scrt.png',
    coinGeckoId: 'secret',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uscrt',
        path: 'transfer/channel-88',
        channelId: 'channel-88',
        hash: '0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  XPRT: {
    name: 'Persistence',
    symbol: 'XPRT',
    decimals: 6,
    logo: 'xprt.svg',
    coinGeckoId: 'persistence',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'uxprt',
        path: 'transfer/channel-82',
        channelId: 'channel-82',
        hash: 'B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  EVMOS: {
    name: 'Evmos',
    symbol: 'EVMOS',
    decimals: 18,
    logo: 'evmos.svg',
    coinGeckoId: 'evmos',

    ibcs: [
      {
        decimals: 18,
        isNative: true,
        baseDenom: 'aevmos',
        path: 'transfer/channel-83',
        channelId: 'channel-83',
        hash: '16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  STX: {
    name: 'Stacks',
    symbol: 'STX',
    decimals: 6,
    logo: 'stacks.png',
    coinGeckoId: 'blockstack',
  },

  DOT: {
    name: 'Polkadot',
    symbol: 'DOT',
    decimals: 10,
    logo: 'dot.jpeg',
    coinGeckoId: 'polkadot',

    erc20: {
      decimals: 10,
      address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
      tokenType: TokenType.Erc20,
    },

    ibcs: [
      {
        decimals: 10,
        isNative: false,
        baseDenom: 'dot-planck',
        path: 'transfer/channel-84',
        channelId: 'channel-84',
        hash: '624BA9DD171915A2B9EA70F69638B2CEA179959850C1A586F6C485498F29EDD4',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  'DOT-PLANCK': {
    name: 'Polkadot',
    symbol: 'DOT',
    decimals: 10,
    logo: 'dot.jpeg',
    coinGeckoId: 'polkadot',

    erc20: {
      decimals: 10,
      address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
      tokenType: TokenType.Erc20,
    },
  },

  STRD: {
    name: 'Stride',
    symbol: 'STRD',
    decimals: 6,
    logo: 'stride.png',
    coinGeckoId: 'stride',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'ustrd',
        path: 'transfer/channel-89',
        channelId: 'channel-89',
        hash: '3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  CRE: {
    name: 'Crescent',
    symbol: 'CRE',
    decimals: 6,
    logo: 'crescent.jpeg',
    coinGeckoId: 'crescent-network',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'ucre',
        path: 'transfer/channel-90',
        channelId: 'channel-90',
        hash: '3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  PROJ: {
    name: 'PROJ',
    logo: 'projx.png',
    symbol: 'Proj',
    decimals: 6,
    coinGeckoId: '',
  },

  ASTRO: {
    name: 'ASTRO',
    symbol: 'ASTRO',
    decimals: 6,
    logo: 'astroport.png',
    coinGeckoId: 'astroport-fi',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'ASTRO',
        path: 'transfer/channel-13',
        channelId: 'channel-13',
        hash: 'E8AC6B792CDE60AB208CA060CA010A3881F682A7307F624347AB71B6A0B0BF89',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 8,
    logo: 'solana.svg',
    coinGeckoId: 'solana',

    spl: {
      decimals: 9,
      address: '',
      isNative: true,
      tokenType: TokenType.Spl,
    },

    cw20s: [
      {
        decimals: 8,
        address: 'inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  SOMM: {
    name: 'Sommelier',
    symbol: 'SOMM',
    decimals: 6,
    logo: 'sommelier.png',
    coinGeckoId: 'sommelier',

    ibcs: [
      {
        decimals: 6,
        isNative: true,
        baseDenom: 'usomm',
        path: 'transfer/channel-93',
        channelId: 'channel-93',
        hash: '34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
        tokenType: TokenType.Ibc,
      },
    ],
  },

  ETHBTCTREND: {
    name: 'ETHBTC Trend',
    symbol: 'ETHBTCTrend',
    decimals: 18,
    logo: 'ethbtctrend.svg',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      address: '0x6b7f87279982d919Bbf85182DDeAB179B366D8f2',
      tokenType: TokenType.Erc20,
    },
  },

  STEADYETH: {
    name: 'SteadyETH',
    symbol: 'SteadyETH',
    decimals: 18,
    logo: 'steadyeth.svg',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      address: '0x3F07A84eCdf494310D397d24c1C78B041D2fa622',
      tokenType: TokenType.Erc20,
    },
  },

  STEADYBTC: {
    name: 'SteadyBTC',
    symbol: 'SteadyBTC',
    decimals: 18,
    logo: 'steadybtc.svg',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      address: '0x4986fD36b6b16f49b43282Ee2e24C5cF90ed166d',
      tokenType: TokenType.Erc20,
    },
  },

  XPLA: {
    name: 'XPLA',
    symbol: 'XPLA',
    decimals: 8,
    logo: 'xpla.svg',
    coinGeckoId: 'xpla',

    cw20s: [
      {
        decimals: 8,
        address: 'inj1j08452mqwadp8xu25kn9rleyl2gufgfjqjvewe',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  AVAX: {
    name: 'AVAX',
    symbol: 'WAVAX',
    decimals: 8,
    logo: 'avax.webp',
    coinGeckoId: 'AVAX',

    cw20s: [
      {
        decimals: 8,
        address: 'inj18a2u6az6dzw528rptepfg6n49ak6hdzkny4um6',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  BONK: {
    name: 'BONK',
    symbol: 'BONK',
    decimals: 5,
    logo: 'bonk.jpeg',
    coinGeckoId: 'bonk',
  },

  CHZ: {
    name: 'Chiliz',
    symbol: 'CHZ',
    decimals: 18,
    logo: 'chz.png',
    coinGeckoId: 'chiliz',

    erc20: {
      decimals: 18,
      address: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        decimals: 8,
        address: 'inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  CANTO: {
    name: 'Canto',
    symbol: 'CANTO',
    decimals: 18,
    logo: 'canto.webp',
    coinGeckoId: 'canto',

    ibcs: [
      {
        decimals: 18,
        isNative: true,
        baseDenom: 'acanto',
        path: 'transfer/channel-99',
        channelId: 'channel-99',
        hash: 'C733F37CB50114AFE8053C320DF45D0AAD8B94F556EB306AC2ABA0B9963CDF0D',
        tokenType: TokenType.Ibc,
      },
    ],
  },
} as Record<string, TokenMeta>
