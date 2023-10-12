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
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
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
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        decimals: 18,
        symbol: 'wBTC',
        source: Cw20TokenSource.Cosmos,
        address: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
        tokenType: TokenType.Cw20,
      },
    ],
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
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
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
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
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
      address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
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
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
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
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
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
      address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
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
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
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
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
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
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
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
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
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
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
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
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      tokenType: TokenType.Erc20,
    },
  },

  MATIC: {
    name: 'Polygon',
    logo: 'polygon.png',
    symbol: 'MATIC',
    decimals: 18,
    coinGeckoId: 'matic-network',

    erc20: {
      decimals: 18,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
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
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
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
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
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
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
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
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
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
      address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
      tokenType: TokenType.Erc20,
    },
  },

  '1INCH': {
    name: '1inch',
    symbol: '1INCH',
    decimals: 18,
    logo: '1inch.png',
    coinGeckoId: '1inch',

    erc20: {
      decimals: 18,
      address: '0x111111111117dC0aa78b770fA6A738034120C302',
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
      address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
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
      address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
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
      address: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d',
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
      address: '0x26c8AFBBFE1EBaca03C2bB082E69D0476Bffe099',
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
      address: '0xfa6de2697D59E88Ed7Fc4dFE5A33daC43565ea41',
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
      address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
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
      address: '0x50f09629d0afDF40398a3F317cc676cA9132055c',
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
      address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
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
      address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
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
      address: '0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206',
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
      address: '0xa8c8CfB141A3bB59FEA1E2ea6B79b5ECBCD7b6ca',
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
      address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
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
      address: '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
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
      address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
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
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
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
      address: '0xc55c2175E90A46602fD42e931f62B3Acc1A013Ca',
      tokenType: TokenType.Erc20,
    },
  },

  STT: {
    name: 'Scatter.cx',
    symbol: 'STT',
    decimals: 18,
    logo: 'scatter.webp',
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
    logo: 'trustswap.png',
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
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
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
      address: '0xdc9Ac3C20D1ed0B540dF9b1feDC10039Df13F99c',
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

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uatom',
      path: 'transfer/channel-1',
      channelId: 'channel-1',
      hash: 'C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
      tokenType: TokenType.Ibc,
    },
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

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uphoton',
      path: 'transfer/channel-2',
      channelId: 'channel-2',
      hash: '48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
      tokenType: TokenType.Ibc,
    },
  },

  LUNA: {
    name: 'Terra',
    symbol: 'LUNA',
    decimals: 6,
    logo: 'luna.png',
    coinGeckoId: 'terra-luna',

    erc20: {
      decimals: 6,
      address: '0xd2877702675e6cEb975b4A1dFf9fb7BAF4C91ea9',
      tokenType: TokenType.Erc20,
    },

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uluna',
      path: 'transfer/channel-4',
      channelId: 'channel-4',
      hash: 'B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
      tokenType: TokenType.Ibc,
    },
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

    ibc: {
      decimals: 18,
      isNative: true,
      baseDenom: 'uusd',
      path: 'transfer/channel-4',
      channelId: 'channel-4',
      hash: 'B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
      tokenType: TokenType.Ibc,
    },
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
      address: '0x080B12E80C9b45e97C23b6ad10a16B3e2a123949',
      tokenType: TokenType.Erc20,
    },
  },

  OSMO: {
    name: 'Osmosis',
    symbol: 'OSMO',
    decimals: 6,
    coinGeckoId: 'osmosis',
    logo: 'osmo.png',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uosmo',
      path: 'transfer/channel-8',
      channelId: 'channel-8',
      hash: '92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
      tokenType: TokenType.Ibc,
    },
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

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uhuahua',
      path: 'transfer/channel-76',
      channelId: 'channel-76',
      hash: 'E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
      tokenType: TokenType.Ibc,
    },
  },

  JUNO: {
    name: 'Juno',
    symbol: 'JUNO',
    decimals: 6,
    logo: 'juno.jpeg',
    coinGeckoId: 'juno-network',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ujuno',
      path: 'transfer/channel-78',
      channelId: 'channel-78',
      hash: 'D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
      tokenType: TokenType.Ibc,
    },
  },

  WHALE: {
    name: 'White Whale',
    symbol: 'WHALE',
    decimals: 6,
    logo: 'whale.svg',
    coinGeckoId: 'white-whale',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uwhale',
      path: 'transfer/channel-102',
      channelId: 'channel-102',
      hash: 'D6E6A20ABDD600742D22464340A7701558027759CE14D12590F8EA869CCCF445',
      tokenType: TokenType.Ibc,
    },
  },

  AXL: {
    name: 'Axelar',
    logo: 'axelar.svg',
    symbol: 'AXL',
    decimals: 6,
    coinGeckoId: 'axelar',

    erc20: {
      decimals: 6,
      address: '0x3eacbDC6C382ea22b78aCc158581A55aaF4ef3Cc',
      tokenType: TokenType.Erc20,
    },

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uaxl',
      path: 'transfer/channel-84',
      channelId: 'channel-84',
      hash: 'B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
      tokenType: TokenType.Ibc,
    },
  },

  BAYC: {
    name: 'Bored Ape Yacht Club',
    symbol: 'BAYC',
    logo: 'bayc.svg',
    decimals: 18,
    coinGeckoId: '',
  },

  APE: {
    name: 'Ape Coin',
    symbol: 'APE',
    decimals: 18,
    logo: 'ape.png',
    coinGeckoId: 'apecoin',

    erc20: {
      decimals: 18,
      address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
      tokenType: TokenType.Erc20,
    },
  },

  SCRT: {
    name: 'Secret Network',
    symbol: 'SCRT',
    decimals: 6,
    logo: 'scrt.png',
    coinGeckoId: 'secret',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uscrt',
      path: 'transfer/channel-88',
      channelId: 'channel-88',
      hash: '0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
      tokenType: TokenType.Ibc,
    },
  },

  XPRT: {
    name: 'Persistence',
    symbol: 'XPRT',
    decimals: 6,
    logo: 'xprt.svg',
    coinGeckoId: 'persistence',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uxprt',
      path: 'transfer/channel-82',
      channelId: 'channel-82',
      hash: 'B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
      tokenType: TokenType.Ibc,
    },
  },

  EVMOS: {
    name: 'Evmos',
    symbol: 'EVMOS',
    decimals: 18,
    logo: 'evmos.svg',
    coinGeckoId: 'evmos',

    ibc: {
      decimals: 18,
      isNative: true,
      baseDenom: 'aevmos',
      path: 'transfer/channel-83',
      channelId: 'channel-83',
      hash: '16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
      tokenType: TokenType.Ibc,
    },
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

    ibc: {
      decimals: 10,
      isNative: false,
      baseDenom: 'dot-planck',
      path: 'transfer/channel-84',
      channelId: 'channel-84',
      hash: '624BA9DD171915A2B9EA70F69638B2CEA179959850C1A586F6C485498F29EDD4',
      tokenType: TokenType.Ibc,
    },

    cw20: {
      decimals: 10,
      address: 'inj1spzwwtr2luljr300ng2gu52zg7wn7j44m92mdf',
      tokenType: TokenType.Cw20,
    },
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

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ustrd',
      path: 'transfer/channel-89',
      channelId: 'channel-89',
      hash: '3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
      tokenType: TokenType.Ibc,
    },
  },
  CRE: {
    name: 'Crescent',
    symbol: 'CRE',
    decimals: 6,
    logo: 'crescent.jpeg',
    coinGeckoId: 'crescent-network',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ucre',
      path: 'transfer/channel-90',
      channelId: 'channel-90',
      hash: '3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
      tokenType: TokenType.Ibc,
    },
  },

  PROJ: {
    name: 'PROJ',
    logo: 'projx.png',
    symbol: 'PROJ',
    decimals: 18,
    coinGeckoId: '',
  },

  MITOTEST1: {
    name: 'MT1',
    symbol: 'MT1',
    decimals: 18,
    logo: 'projx.png',
    coinGeckoId: '',
  },

  ASTRO: {
    name: 'ASTRO',
    symbol: 'ASTRO',
    decimals: 6,
    logo: 'astroport.png',
    coinGeckoId: 'astroport-fi',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom:
        'cw20:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26',
      path: 'transfer/channel-104',
      channelId: 'channel-104',
      hash: 'EBD5A24C554198EBAF44979C5B4D2C2D312E6EBAB71962C92F735499C7575839',
      tokenType: TokenType.Ibc,
    },
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

    cw20: {
      decimals: 8,
      address: 'inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
      tokenType: TokenType.Cw20,
    },
  },

  SOMM: {
    name: 'Sommelier',
    symbol: 'SOMM',
    decimals: 6,
    logo: 'sommelier.png',
    coinGeckoId: 'sommelier',

    erc20: {
      decimals: 6,
      address: '0xa670d7237398238DE01267472C6f13e5B8010FD1',
      tokenType: TokenType.Erc20,
    },

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'usomm',
      path: 'transfer/channel-93',
      channelId: 'channel-93',
      hash: '34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
      tokenType: TokenType.Ibc,
    },
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

    cw20: {
      decimals: 8,
      address: 'inj1j08452mqwadp8xu25kn9rleyl2gufgfjqjvewe',
      tokenType: TokenType.Cw20,
    },
  },

  AVAX: {
    name: 'AVAX',
    symbol: 'WAVAX',
    decimals: 8,
    logo: 'avax.webp',
    coinGeckoId: 'avalanche-2',

    cw20: {
      decimals: 8,
      address: 'inj18a2u6az6dzw528rptepfg6n49ak6hdzkny4um6',
      tokenType: TokenType.Cw20,
    },
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
      address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 8,
      address: 'inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh',
      tokenType: TokenType.Cw20,
    },
  },

  CANTO: {
    name: 'Canto',
    symbol: 'CANTO',
    decimals: 18,
    logo: 'canto.webp',
    coinGeckoId: 'canto',

    ibc: {
      decimals: 18,
      isNative: true,
      baseDenom: 'acanto',
      path: 'transfer/channel-99',
      channelId: 'channel-99',
      hash: 'D91A2C4EE7CD86BBAFCE0FA44A60DDD9AFBB7EEB5B2D46C0984DEBCC6FEDFAE8',
      tokenType: TokenType.Ibc,
    },
  },

  QAT: {
    name: 'Test QAT',
    symbol: 'QAT',
    decimals: 18,
    logo: 'injective-v3.svg',
    coinGeckoId: 'injective-protocol',

    erc20: {
      decimals: 18,
      address: '0x1902e18fEB1234D00d880f1fACA5C8d74e8501E9',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 8,
      address: 'inj1m4g54lg2mhhm7a4h3ms5xlyecafhe4macgsuen',
      tokenType: TokenType.Cw20,
    },
  },

  PUGGO: {
    name: 'Puggo',
    symbol: 'PUG',
    decimals: 18,
    logo: 'puggo.jpg',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      address: '0xf9a06dE3F6639E6ee4F079095D5093644Ad85E8b',
      tokenType: TokenType.Erc20,
    },
  },

  LDO: {
    name: 'Lido DAO Token',
    symbol: 'LDO',
    decimals: 18,
    logo: 'lido-dao.webp',
    coinGeckoId: 'lido-dao',

    erc20: {
      decimals: 18,
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 8,
      address: 'inj1me6t602jlndzxgv2d7ekcnkjuqdp7vfh4txpyy',
      tokenType: TokenType.Cw20,
    },
  },

  USDCfr: {
    name: 'USDC Frontrunner',
    symbol: 'USDCfr',
    decimals: 6,
    logo: 'usdc.svg',
    coinGeckoId: 'usd-coin',

    erc20: {
      decimals: 6,
      address: '0xf9152067989BDc8783fF586624124C05A529A5D1',
      tokenType: TokenType.Erc20,
    },
  },

  ARB: {
    name: 'Arbitrum',
    symbol: 'ARB',
    decimals: 18,
    logo: 'arb.png',
    coinGeckoId: 'arbitrum',

    evm: {
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      tokenType: TokenType.Erc20,
    },

    erc20: {
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 8,
      address: 'inj1d5vz0uzwlpfvgwrwulxg6syy82axa58y4fuszd',
      source: Cw20TokenSource.Arbitrum,
      tokenType: TokenType.Cw20,
    },
  },

  EUR: {
    name: 'Euro',
    symbol: 'EUR',
    decimals: 6,
    logo: 'eur.svg',
    coinGeckoId: '',
  },

  GBP: {
    name: 'British Pound',
    symbol: 'GBP',
    decimals: 6,
    logo: 'gpb.svg',
    coinGeckoId: '',
  },

  JPY: {
    name: 'Japanese Yen',
    symbol: 'JPY',
    decimals: 6,
    logo: 'jpy.svg',
    coinGeckoId: '',
  },

  BRZ: {
    name: 'Brazilian Digital Token',
    symbol: 'BRZ',
    decimals: 4,
    logo: 'brz.png',
    coinGeckoId: 'brz',

    erc20: {
      decimals: 4,
      address: '0x420412E765BFa6d85aaaC94b4f7b708C89be2e2B',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 4,
      address: 'inj14jesa4q248mfxztfc9zgpswkpa4wx249mya9kk',
      tokenType: TokenType.Cw20,
    },
  },

  ASTR: {
    name: 'Astar',
    symbol: 'ASTR',
    decimals: 18,
    logo: 'astar.svg',
    coinGeckoId: 'astar',

    cw20: {
      decimals: 18,
      address: 'inj1mhmln627samtkuwe459ylq763r4n7n69gxxc9x',
      tokenType: TokenType.Cw20,
    },
  },

  XAU: {
    name: 'Gold',
    symbol: 'XAU',
    decimals: 6,
    logo: 'gold.svg',
    coinGeckoId: '',
  },

  ALPHA: {
    name: 'Alpha Coin',
    symbol: 'ALPHA',
    decimals: 18,
    logo: 'alpha.png',
    coinGeckoId: 'alphacoin',

    erc20: {
      decimals: 18,
      address: '0x138C2F1123cF3f82E4596d097c118eAc6684940B',
      tokenType: TokenType.Erc20,
    },

    cw20: {
      decimals: 8,
      address: 'inj1zwnsemwrpve3wrrg0njj89w6mt5rmj9ydkc46u',
      tokenType: TokenType.Cw20,
    },
  },

  WMATIC: {
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    decimals: 18,
    logo: 'polygon.png',
    coinGeckoId: 'wmatic',

    evm: {
      decimals: 18,
      isNative: true,
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      tokenType: TokenType.Evm,
    },

    cw20: {
      decimals: 8,
      address: 'inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
      source: Cw20TokenSource.Polygon,
      tokenType: TokenType.Cw20,
    },
  },

  '1MPEPE': {
    name: 'Pepe',
    symbol: 'MPEPE',
    decimals: 18,
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      tokenType: TokenType.Erc20,
    },
  },

  '1000PEPE': {
    name: 'Pepe',
    symbol: 'KPEPE',
    decimals: 18,
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      tokenType: TokenType.Erc20,
    },
  },

  PEPE: {
    name: 'Pepe',
    symbol: 'PEPE',
    decimals: 18,
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      tokenType: TokenType.Erc20,
    },
  },

  WASSIE: {
    name: 'WASSIE',
    symbol: 'WASSIE',
    decimals: 18,
    logo: 'wassie.jpeg',
    coinGeckoId: 'wassie',

    erc20: {
      decimals: 18,
      address: '0x2c95d751da37a5c1d9c5a7fd465c1d50f3d96160',
      tokenType: TokenType.Erc20,
    },
  },

  RIBBIT: {
    name: 'Ribbit Meme',
    symbol: 'RIBBIT',
    decimals: 18,
    logo: 'ribbit.jpeg',
    coinGeckoId: 'ribbit-meme',

    erc20: {
      decimals: 18,
      address: '0xb794Ad95317f75c44090f64955954C3849315fFe',
      tokenType: TokenType.Erc20,
    },
  },

  LAMBO: {
    name: 'Lambo',
    symbol: 'LAMBO',
    decimals: 18,
    logo: 'lambo.jpeg',
    coinGeckoId: 'lambo-0fcbf0f7-1a8f-470d-ba09-797d5e95d836',

    erc20: {
      decimals: 18,
      address: '0x3d2b66BC4f9D6388BD2d97B95b565BE1686aEfB3',
      tokenType: TokenType.Erc20,
    },
  },

  STINJ: {
    name: 'Stride Staked Injective',
    symbol: 'STINJ',
    decimals: 18,
    logo: 'stinj.png',
    coinGeckoId: 'stride-staked-injective',

    ibc: {
      decimals: 18,
      isNative: true,
      baseDenom: 'stinj',
      path: 'transfer/channel-89',
      channelId: 'channel-89',
      hash: 'AC87717EA002B0123B10A05063E69BCA274BA2C44D842AEEB41558D2856DCE93',
      tokenType: TokenType.Ibc,
    },
  },

  XRP: {
    name: 'Ripple',
    symbol: 'XRP',
    decimals: 18,
    address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
    logo: 'xrp.png',
    coinGeckoId: 'ripple',
  },

  FRCOIN: {
    name: 'Frontrunner Coin',
    symbol: 'FRCoin',
    decimals: 6,
    logo: 'frcoin.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  DEMO: {
    name: 'Demo Coin',
    symbol: 'DEMO',
    decimals: 6,
    logo: 'injective-v3.svg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  RAI: {
    name: 'Rai Reflex Index',
    symbol: 'RAI',
    decimals: 18,
    logo: 'rai.png',
    coinGeckoId: 'rai',

    erc20: {
      decimals: 18,
      address: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
      tokenType: TokenType.Erc20,
    },
  },

  BTSG: {
    name: 'Rai Reflex Index',
    symbol: 'BitSong',
    decimals: 18,
    logo: 'btsg.png',
    coinGeckoId: 'bitsong',

    erc20: {
      decimals: 18,
      address: '0x05079687D35b93538cbd59fe5596380cae9054A9',
      tokenType: TokenType.Erc20,
    },
  },

  CVR: {
    name: 'CoverCompared',
    symbol: 'CVR',
    decimals: 18,
    logo: 'cvr.png',
    coinGeckoId: 'covercompared',

    erc20: {
      decimals: 18,
      address: '0x3c03b4ec9477809072ff9cc9292c9b25d4a8e6c6',
      tokenType: TokenType.Erc20,
    },
  },

  QNT: {
    name: 'Quant',
    symbol: 'QNT',
    decimals: 18,
    logo: 'qnt.png',
    coinGeckoId: 'quant-network',

    erc20: {
      decimals: 18,
      address: '0x4a220e6096b25eadb88358cb44068a3248254675',
      tokenType: TokenType.Erc20,
    },
  },

  WSTETH: {
    name: 'Lido wstETH',
    symbol: 'WSTETH',
    decimals: 18,
    logo: 'wsteth.png',
    coinGeckoId: 'wrapped-steth',

    erc20: {
      decimals: 18,
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
      tokenType: TokenType.Erc20,
    },
  },

  DYDX: {
    name: 'dYdX',
    symbol: 'dYdX',
    decimals: 18,
    logo: 'dydx.png',
    coinGeckoId: 'dydx',

    erc20: {
      decimals: 18,
      address: '0x92d6c1e31e14520e676a687f0a93788b716beff5',
      tokenType: TokenType.Erc20,
    },
  },

  XAC: {
    name: 'General Attention Currency',
    symbol: 'XAC',
    decimals: 8,
    logo: 'xac.png',
    coinGeckoId: '',

    erc20: {
      decimals: 8,
      address: '0xDe4C5a791913838027a2185709E98c5C6027EA63',
      tokenType: TokenType.Erc20,
    },
  },

  STETH: {
    name: 'Lido Staked ETH',
    symbol: 'stETH',
    decimals: 18,
    logo: 'steth.png',
    coinGeckoId: 'staked-ether',

    erc20: {
      decimals: 18,
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      tokenType: TokenType.Erc20,
    },
  },

  LYM: {
    name: 'Lympo',
    symbol: 'LYM',
    decimals: 18,
    logo: 'lympo.png',
    coinGeckoId: 'lympo',

    erc20: {
      decimals: 18,
      address: '0xc690f7c7fcffa6a82b79fab7508c466fefdfc8c5',
      tokenType: TokenType.Erc20,
    },
  },

  OMI: {
    name: 'ECOMI',
    symbol: 'OMI',
    decimals: 18,
    logo: 'ecomi.png',
    coinGeckoId: 'ecomi',

    erc20: {
      decimals: 18,
      address: '0xed35af169af46a02ee13b9d79eb57d6d68c1749e',
      tokenType: TokenType.Erc20,
    },
  },

  POINT: {
    name: 'Reward Point Token',
    symbol: 'POINT',
    decimals: 0,
    logo: 'point.svg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  KAVA: {
    name: 'KAVA',
    symbol: 'KAVA',
    decimals: 6,
    logo: 'kava.webp',
    coinGeckoId: 'kava',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ukava',
      path: 'transfer/channel-143',
      channelId: 'channel-143',
      hash: '57AA1A70A4BC9769C525EBF6386F7A21536E04A79D62E1981EFCEF9428EBB205',
      tokenType: TokenType.Ibc,
    },
  },

  USDTkv: {
    name: 'Tether',
    symbol: 'USDTkv',
    decimals: 6,
    logo: 'usdt.svg',
    coinGeckoId: 'tether',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'erc20/tether/usdt',
      path: 'transfer/channel-143',
      channelId: 'channel-143',
      hash: '4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
      tokenType: TokenType.Ibc,
    },
  },

  SEI: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 6,
    logo: 'sei.webp',
    coinGeckoId: 'sei-network',
  },

  VATRENI: {
    name: 'Vatreni Token',
    symbol: 'VATRENI',
    decimals: 18,
    logo: 'vatreni.jpeg',
    coinGeckoId: 'croatian-ff-fan-token',

    evm: {
      decimals: 18,
      isNative: true,
      address: '0xD60DebA014459F07BBcC077a5B817f31DaFD5229',
      tokenType: TokenType.Evm,
    },

    cw20: {
      decimals: 8,
      address: 'inj1tn457ed2gg5vj2cur5khjjw63w73y3xhyhtaay',
      source: Cw20TokenSource.Polygon,
      tokenType: TokenType.Cw20,
    },
  },

  NBLA: {
    name: 'Nebula',
    symbol: 'NBLA',
    decimals: 6,
    logo: 'nebula.png',
    coinGeckoId: '',
  },

  WKLAY: {
    name: 'Wrapped Klaytn',
    symbol: 'WKLAY',
    decimals: 8,
    logo: 'klaytn.webp',
    coinGeckoId: 'klay-token',

    cw20: {
      decimals: 8,
      address: 'inj14cl67lprqkt3pncjav070gavaxslc0tzpc56f4',
      tokenType: TokenType.Cw20,
    },
  },

  NEOK: {
    name: 'NEOKingdom DAO',
    symbol: 'NEOK',
    decimals: 18,
    logo: 'neok.svg',
    coinGeckoId: '',

    ibc: {
      decimals: 18,
      isNative: true,
      baseDenom: 'erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9',
      path: 'transfer/channel-83',
      channelId: 'channel-83',
      hash: 'F6CC233E5C0EA36B1F74AB1AF98471A2D6A80E2542856639703E908B4D93E7C4',
      tokenType: TokenType.Ibc,
    },
  },

  ORAI: {
    name: 'Oraichain',
    symbol: 'ORAI',
    decimals: 6,
    logo: 'orai.svg',
    coinGeckoId: 'oraichain-token',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'orai',
      path: 'transfer/channel-147',
      channelId: 'channel-147',
      hash: 'C20C0A822BD22B2CEF0D067400FCCFB6FAEEE9E91D360B4E0725BD522302D565',
      tokenType: TokenType.Ibc,
    },
  },

  GOLD: {
    name: 'GOLD',
    symbol: 'GOLD',
    decimals: 18,
    logo: 'gold.svg',
    coinGeckoId: '',
  },

  EVINDEX: {
    name: 'EVIINDEX',
    symbol: 'EVIINDEX',
    decimals: 18,
    logo: 'truEVINDEX.svg',
    coinGeckoId: '',
  },

  TRUCPI: {
    name: 'TRUCPI',
    symbol: 'TRUCPI',
    decimals: 18,
    logo: 'truflation.svg',
    coinGeckoId: '',
  },

  TIA: {
    name: 'Celestia',
    symbol: 'TIA',
    decimals: 6,
    logo: 'tia.webp',
    coinGeckoId: '',
  },
} as Record<string, TokenMeta>
