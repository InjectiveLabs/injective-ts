import { TokenMetaBase, TokenSource, TokenType } from '../../types'

export default {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'bitcoin.png',
    coinGeckoId: 'bitcoin',
    tokenType: TokenType.Unknown,
  },

  wBTC: {
    name: 'Wrapped Bitcoin',
    logo: 'wbtc.png',
    coinGeckoId: 'wrapped-bitcoin',

    erc20: {
      symbol: 'wBTC',
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    },

    cw20s: [
      {
        decimals: 18,
        symbol: 'wBTC',
        source: TokenSource.Cosmos,
        address: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
      },
    ],
  },

  ETH: {
    name: 'Ethereum',
    logo: 'ethereum.png',
    coinGeckoId: 'ethereum',

    erc20: {
      symbol: 'ETH',
      decimals: 18,
      isNative: true,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },

  wETH: {
    name: 'Wrapped Ethereum',
    logo: 'ethereum.png',
    coinGeckoId: 'ethereum',

    erc20: {
      symbol: 'wETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },

    cw20s: [
      {
        symbol: 'wETH',
        decimals: 8,
        address: 'inj1plsk58sxqjw9828aqzeskmc8xy9eu5kppw3jg4',
        source: TokenSource.Arbitrum,
      },
      {
        symbol: 'wETH',
        decimals: 8,
        address: 'inj1k9r62py07wydch6sj5sfvun93e4qe0lg7jyatc',
        source: TokenSource.EthereumWh,
      },
    ],
  },

  INJ: {
    name: 'Injective',
    logo: 'injective-v3.png',
    coinGeckoId: 'injective-protocol',

    erc20: {
      symbol: 'INJ',
      decimals: 18,
      address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
    },

    cw20s: [
      {
        decimals: 8,
        symbol: 'INJbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1xcgprh58szttp0vqtztvcfy34tkpupr563ua40',
      },
      {
        decimals: 8,
        symbol: 'INJet',
        source: TokenSource.EthereumWh,
        address: 'inj1v8gg4wzfauwf9l7895t0eyrrkwe65vh5n7dqmw',
      },
    ],
  },

  USDT: {
    name: 'Tether',
    logo: 'usdt.png',
    coinGeckoId: 'tether',

    erc20: {
      symbol: 'USDT',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },

    ibcs: [
      {
        decimals: 6,
        symbol: 'USDTkv',
        isNative: true,
        baseDenom: 'erc20/tether/usdt',
        path: 'transfer/channel-143',
        channelId: 'channel-143',
        hash: '4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
        source: TokenSource.Cosmos,
      },
    ],

    cw20s: [
      {
        decimals: 6,
        symbol: 'USDTbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1l9eyrnv3ret8da3qh8j5aytp6q4f73crd505lj',
      },
      {
        decimals: 6,
        symbol: 'USDTet',
        source: TokenSource.EthereumWh,
        address: 'inj18zykysxw9pcvtyr9ylhe0p5s7yzf6pzdagune8',
      },
      {
        decimals: 6,
        symbol: 'USDTap',
        source: TokenSource.Aptos,
        address: 'inj13yrhllhe40sd3nj0lde9azlwfkyrf2t9r78dx5',
      },
      {
        decimals: 6,
        symbol: 'USDTso',
        source: TokenSource.Solana,
        address: 'inj1qjn06jt7zjhdqxgud07nylkpgnaurq6xc5c4fd',
      },
    ],
  },

  USDC: {
    name: 'USD Coin',
    logo: 'usdc.png',
    coinGeckoId: 'usd-coin',

    erc20: {
      decimals: 6,
      symbol: 'USDClegacy',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },

    cw20s: [
      {
        name: 'USD Coin (legacy)',
        decimals: 6,
        symbol: 'USDCet',
        source: TokenSource.EthereumWh,
        address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
      },
      {
        decimals: 6,
        symbol: 'USDCso',
        source: TokenSource.Solana,
        address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
      },
      {
        decimals: 6,
        symbol: 'USDCarb',
        source: TokenSource.Arbitrum,
        address: 'inj1lmcfftadjkt4gt3lcvmz6qn4dhx59dv2m7yv8r',
      },
      {
        decimals: 6,
        symbol: 'USDCbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1dngqzz6wphf07fkdam7dn55t8t3r6qenewy9zu',
      },
      {
        decimals: 6,
        symbol: 'USDCpoly',
        source: TokenSource.Polygon,
        address: 'inj19s2r64ghfqq3py7f5dr0ynk8yj0nmngca3yvy3',
      },
    ],

    ibcs: [
      {
        decimals: 6,
        symbol: 'axlUSDC',
        baseDenom: 'uusdc',
        isNative: false,
        channelId: 'channel-84',
        path: 'transfer/channel-84',
        hash: '7E1AF94AD246BE522892751046F0C959B768642E5671CC3742264068D49553C0',
        source: TokenSource.Axelar,
      },
      {
        decimals: 6,
        symbol: 'USDC',
        baseDenom: 'uusdc',
        isNative: true,
        channelId: 'channel-148',
        path: 'transfer/channel-148',
        hash: '2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
        source: TokenSource.Cosmos,
      },
      {
        decimals: 6,
        symbol: 'USDCgateway',
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/GGh9Ufn1SeDGrhzEkMyRKt5568VbbxZK2yvWNsd6PbXt',
        isNative: false,
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '7BE71BB68C781453F6BB10114F8E2DF8DC37BA791C502F5389EA10E7BEA68323',
        source: TokenSource.EthereumWh,
      },
    ],

    spl: {
      decimals: 6,
      symbol: 'USDCso',
      isNative: false,
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
  },

  GRT: {
    name: 'Graph Token',
    logo: 'graphToken.png',
    coinGeckoId: 'the-graph',

    erc20: {
      symbol: 'GRT',
      decimals: 18,
      address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    },
  },

  SNX: {
    name: 'Synthetix Network Token',
    logo: 'synthetix.png',
    coinGeckoId: 'havven',

    erc20: {
      symbol: 'SNX',
      decimals: 18,
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    },
  },

  BNB: {
    name: 'Binance Coin',
    logo: 'bnb.png',
    coinGeckoId: 'binancecoin',

    erc20: {
      symbol: 'BNB',
      decimals: 18,
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    },
  },

  AAVE: {
    name: 'Aave',
    logo: 'AAVE.png',
    coinGeckoId: 'aave',

    erc20: {
      symbol: 'AAVE',
      decimals: 18,
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    },
  },

  YFI: {
    name: 'yearn.finance',
    logo: 'yfi.png',
    coinGeckoId: 'yearn-finance',

    erc20: {
      symbol: 'YFI',
      decimals: 18,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    },
  },

  COMP: {
    name: 'Compound',
    logo: 'comp.png',
    coinGeckoId: 'compound-coin',

    erc20: {
      symbol: 'COMP',
      decimals: 18,
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    },
  },

  ZRX: {
    name: '0x',
    logo: 'zrx.png',
    coinGeckoId: '0x',

    erc20: {
      symbol: 'ZRX',
      decimals: 18,
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    },
  },

  MATIC: {
    name: 'Polygon',
    logo: 'polygon.png',
    coinGeckoId: 'matic-network',

    erc20: {
      symbol: 'MATIC',
      decimals: 18,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    },
  },

  UNI: {
    name: 'Uniswap',
    logo: 'uni.png',
    coinGeckoId: 'uniswap',

    erc20: {
      symbol: 'UNI',
      decimals: 18,
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    },
  },

  DAI: {
    name: 'Dai',
    logo: 'dai.png',
    coinGeckoId: 'dai',

    erc20: {
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  },

  LINK: {
    name: 'Chainlink',
    logo: 'chainlink.png',
    coinGeckoId: 'chainlink',

    erc20: {
      symbol: 'LINK',
      decimals: 18,
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    },
  },

  SUSHI: {
    erc20: {
      coinGeckoId: 'sushi',
      name: 'SushiSwap',
      logo: 'sushi.png',
      symbol: 'SUSHI',
      decimals: 18,
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    },

    cw20s: [
      {
        name: 'SUSHI FIGHTER',
        logo: 'sushi-inj.png',
        symbol: 'SUSHI',
        decimals: 18,
        address: 'inj1n73yuus64z0yrda9hvn77twkspc4uste9j9ydd',
      },
    ],
  },

  AXS: {
    name: 'Axie Infinity',
    logo: 'axs.png',
    coinGeckoId: 'axie-infinity',

    erc20: {
      symbol: 'AXS',
      decimals: 18,
      address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
    },
  },

  '1INCH': {
    name: '1inch',
    logo: '1inch.png',
    coinGeckoId: '1inch',

    erc20: {
      symbol: '1INCH',
      decimals: 18,
      address: '0x111111111117dC0aa78b770fA6A738034120C302',
    },
  },

  BAT: {
    name: 'Basic Attention Token',
    logo: 'bat.png',
    coinGeckoId: 'basic-attention-token',

    erc20: {
      symbol: 'BAT',
      decimals: 18,
      address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    },
  },

  BUSD: {
    name: 'Binance USD',
    logo: 'busd.png',
    coinGeckoId: 'binance-usd',

    erc20: {
      symbol: 'BUSD',
      decimals: 18,
      address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    },
  },

  CEL: {
    name: 'Celsius',
    logo: 'cel.png',
    coinGeckoId: 'celsius-degree-token',

    erc20: {
      symbol: 'CEL',
      decimals: 4,
      address: '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d',
    },
  },

  CELL: {
    name: 'Cellframe',
    logo: 'cell.png',
    coinGeckoId: 'cellframe',

    erc20: {
      symbol: 'CELL',
      decimals: 18,
      address: '0x26c8AFBBFE1EBaca03C2bB082E69D0476Bffe099',
    },
  },

  DEFI5: {
    name: 'DEFI Top 5 Tokens Index',
    logo: 'defi5.png',
    coinGeckoId: 'defi-top-5-tokens-index',

    erc20: {
      symbol: 'DEFI5',
      decimals: 18,
      address: '0xfa6de2697D59E88Ed7Fc4dFE5A33daC43565ea41',
    },
  },

  ENJ: {
    name: 'Enjin Coin',
    logo: 'enj.png',
    coinGeckoId: 'enjincoin',

    erc20: {
      symbol: 'ENJ',
      decimals: 18,
      address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
    },
  },

  EVAI: {
    name: 'Evai.io',
    logo: 'evai.png',
    coinGeckoId: 'evai',

    erc20: {
      symbol: 'EVAI',
      decimals: 8,
      address: '0x50f09629d0afDF40398a3F317cc676cA9132055c',
    },
  },

  FTM: {
    name: 'Fantom',
    logo: 'ftm.png',
    coinGeckoId: 'fantom',

    erc20: {
      symbol: 'FTM',
      decimals: 18,
      address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    },
  },

  HT: {
    name: 'Huobi Token',
    logo: 'ht.png',
    coinGeckoId: 'huobi-token',

    erc20: {
      symbol: 'HT',
      decimals: 18,
      address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
    },
  },

  NEXO: {
    name: 'Nexo',
    logo: 'nexo.png',
    coinGeckoId: 'nexo',

    erc20: {
      symbol: 'NEXO',
      decimals: 18,
      address: '0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206',
    },
  },

  NOIA: {
    name: 'Syntropy',
    logo: 'noia.png',
    coinGeckoId: 'noia-network',

    erc20: {
      symbol: 'NOIA',
      decimals: 18,
      address: '0xa8c8CfB141A3bB59FEA1E2ea6B79b5ECBCD7b6ca',
    },
  },

  OCEAN: {
    name: 'Ocean Protocol',
    logo: 'ocean.png',
    coinGeckoId: 'ocean-protocol',

    erc20: {
      symbol: 'OCEAN',
      decimals: 18,
      address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
    },
  },

  PAXG: {
    name: 'PAX Gold',
    logo: 'paxg.png',
    coinGeckoId: 'pax-gold',

    erc20: {
      symbol: 'PAXG',
      decimals: 18,
      address: '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
    },
  },

  POOL: {
    name: 'PoolTogether',
    logo: 'pool.png',
    coinGeckoId: 'pooltogether',

    erc20: {
      symbol: 'POOL',
      decimals: 18,
      address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    },
  },

  RUNE: {
    name: 'THORChain (ERC20)',
    logo: 'rune.png',
    coinGeckoId: 'thorchain-erc20',

    erc20: {
      symbol: 'RUNE',
      decimals: 18,
      address: '0x3155BA85D5F96b2d030a4966AF206230e46849cb',
    },
  },

  SHIB: {
    name: 'SHIBA INU',
    logo: 'shib.png',
    coinGeckoId: 'shiba-inu',

    erc20: {
      symbol: 'SHIB',
      decimals: 18,
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    },
  },

  STARS: {
    name: 'Mogul Productions',
    logo: 'stars.png',
    coinGeckoId: 'mogul-productions',

    erc20: {
      symbol: 'STARS',
      decimals: 18,
      address: '0xc55c2175E90A46602fD42e931f62B3Acc1A013Ca',
    },
  },

  STT: {
    name: 'Scatter.cx',
    logo: 'scatter.webp',
    coinGeckoId: 'scatter-cx',

    erc20: {
      symbol: 'STT',
      decimals: 18,
      address: '0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd',
    },
  },

  SWAP: {
    name: 'TrustSwap',
    logo: 'trustswap.png',
    coinGeckoId: 'trustswap',

    erc20: {
      symbol: 'SWAP',
      decimals: 18,
      address: '0xcc4304a31d09258b0029ea7fe63d032f52e44efe',
    },
  },

  UMA: {
    name: 'UMA',
    coinGeckoId: 'uma',
    logo: 'uma.png',

    erc20: {
      symbol: 'UMA',
      decimals: 18,
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
    },
  },

  UTK: {
    name: 'Utrust',
    logo: 'utk.png',
    coinGeckoId: 'utrust',

    erc20: {
      symbol: 'UTK',
      decimals: 18,
      address: '0xdc9Ac3C20D1ed0B540dF9b1feDC10039Df13F99c',
    },
  },

  ATOM: {
    name: 'Cosmos',
    logo: 'atom.png',
    coinGeckoId: 'cosmos',

    erc20: {
      symbol: 'ATOM',
      decimals: 6,
      address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    },

    ibcs: [
      {
        symbol: 'ATOM',
        decimals: 6,
        isNative: true,
        baseDenom: 'uatom',
        path: 'transfer/channel-1',
        channelId: 'channel-1',
        hash: 'C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
        source: TokenSource.Cosmos,
      },
    ],
  },

  UPHOTON: {
    name: 'Cosmos Testnet',
    logo: 'atom.png',
    coinGeckoId: 'cosmos',

    erc20: {
      symbol: 'UPHOTON',
      decimals: 6,
      address: '0x8D983cb9388EaC77af0474fA441C4815500Cb7BB',
    },

    ibcs: [
      {
        symbol: 'UPHOTON',
        decimals: 6,
        isNative: true,
        baseDenom: 'uphoton',
        path: 'transfer/channel-2',
        channelId: 'channel-2',
        hash: '48BC9C6ACBDFC1EBA034F1859245D53EA4BF74147189D66F27C23BF966335DFB',
        source: TokenSource.Cosmos,
      },
    ],
  },

  LUNA: {
    name: 'Terra',
    logo: 'luna.png',
    coinGeckoId: 'terra-luna',

    erc20: {
      symbol: 'LUNA',
      decimals: 6,
      address: '0xd2877702675e6cEb975b4A1dFf9fb7BAF4C91ea9',
    },

    ibcs: [
      {
        symbol: 'LUNA',
        decimals: 6,
        isNative: true,
        baseDenom: 'uluna',
        path: 'transfer/channel-4',
        channelId: 'channel-4',
        hash: 'B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
        source: TokenSource.Cosmos,
      },
    ],
  },

  UST: {
    name: 'TerraUSD',
    logo: 'ust.png',
    coinGeckoId: 'terrausd',

    erc20: {
      symbol: 'UST',
      decimals: 18,
      address: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
    },

    ibcs: [
      {
        symbol: 'UST',
        decimals: 18,
        isNative: true,
        baseDenom: 'uusd',
        path: 'transfer/channel-4',
        channelId: 'channel-4',
        hash: 'B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C',
        source: TokenSource.Cosmos,
      },
    ],
  },

  GF: {
    name: 'GuildFi',
    logo: 'gf.png',
    coinGeckoId: 'guildfi',

    erc20: {
      symbol: 'GF',
      decimals: 18,
      address: '0xaaef88cea01475125522e117bfe45cf32044e238',
    },
  },

  XBX: {
    name: 'BurnX',
    logo: 'xbx.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'XBX',
      decimals: 18,
      address: '0x080B12E80C9b45e97C23b6ad10a16B3e2a123949',
    },
  },

  OSMO: {
    name: 'Osmosis',
    coinGeckoId: 'osmosis',
    logo: 'osmo.png',

    ibcs: [
      {
        symbol: 'OSMO',
        decimals: 6,
        isNative: true,
        baseDenom: 'uosmo',
        path: 'transfer/channel-8',
        channelId: 'channel-8',
        hash: '92E0120F15D037353CFB73C14651FC8930ADC05B93100FD7754D3A689E53B333',
        source: TokenSource.Cosmos,
      },
    ],
  },

  TAB: {
    name: 'Injective',
    logo: 'injective-v3.png',
    coinGeckoId: 'injective-protocol',

    erc20: {
      symbol: 'TAB',
      decimals: 18,
      address: '0x36B3D7ACe7201E28040eFf30e815290D7b37ffaD',
    },
  },

  HUAHUA: {
    name: 'Chihuahua',
    logo: 'chihuahua.jpeg',
    coinGeckoId: 'chihuahua-token',

    ibcs: [
      {
        symbol: 'HUAHUA',
        decimals: 6,
        isNative: true,
        baseDenom: 'uhuahua',
        path: 'transfer/channel-76',
        channelId: 'channel-76',
        hash: 'E7807A46C0B7B44B350DA58F51F278881B863EC4DCA94635DAB39E52C30766CB',
        source: TokenSource.Cosmos,
      },
    ],
  },

  JUNO: {
    name: 'Juno',
    logo: 'juno.jpeg',
    coinGeckoId: 'juno-network',

    ibcs: [
      {
        symbol: 'JUNO',
        decimals: 6,
        isNative: true,
        baseDenom: 'ujuno',
        path: 'transfer/channel-78',
        channelId: 'channel-78',
        hash: 'D50E26996253EBAA8C684B9CD653FE2F7665D7BDDCA3D48D5E1378CF6334F211',
        source: TokenSource.Cosmos,
      },
    ],
  },

  WHALE: {
    name: 'White Whale',
    logo: 'whale.png',
    coinGeckoId: 'white-whale',

    ibcs: [
      {
        symbol: 'WHALE',
        decimals: 6,
        isNative: true,
        baseDenom: 'uwhale',
        path: 'transfer/channel-102',
        channelId: 'channel-102',
        hash: 'D6E6A20ABDD600742D22464340A7701558027759CE14D12590F8EA869CCCF445',
        source: TokenSource.Cosmos,
      },
    ],
  },

  NOIS: {
    name: 'Nois',
    coinGeckoId: 'nois',
    logo: 'nois.png',

    ibcs: [
      {
        symbol: 'NOIS',
        decimals: 6,
        isNative: true,
        baseDenom: 'unois',
        path: 'transfer/channel-138',
        channelId: 'channel-138',
        hash: 'DD9182E8E2B13C89D6B4707C7B43E8DB6193F9FF486AFA0E6CF86B427B0D231A',
        source: TokenSource.Cosmos,
      },
    ],
  },

  AXL: {
    name: 'Axelar',
    logo: 'axelar.png',
    coinGeckoId: 'axelar',

    erc20: {
      symbol: 'AXL',
      decimals: 6,
      address: '0x3eacbDC6C382ea22b78aCc158581A55aaF4ef3Cc',
    },

    ibcs: [
      {
        symbol: 'AXL',
        decimals: 6,
        isNative: true,
        baseDenom: 'uaxl',
        path: 'transfer/channel-84',
        channelId: 'channel-84',
        hash: 'B68C1D2682A8B69E20BB921E34C6A3A2B6D1E13E3E8C0092E373826F546DEE65',
        source: TokenSource.Cosmos,
      },
    ],
  },

  BAYC: {
    name: 'Bored Ape Yacht Club',
    symbol: 'BAYC',
    logo: 'bayc.png',
    decimals: 18,
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  APE: {
    name: 'Ape Coin',
    logo: 'ape.png',
    coinGeckoId: 'apecoin',

    erc20: {
      symbol: 'APE',
      decimals: 18,
      address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    },
  },

  SCRT: {
    name: 'Secret Network',
    logo: 'scrt.png',
    coinGeckoId: 'secret',

    ibcs: [
      {
        symbol: 'SCRT',
        decimals: 6,
        isNative: true,
        baseDenom: 'uscrt',
        path: 'transfer/channel-88',
        channelId: 'channel-88',
        hash: '0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
        source: TokenSource.Cosmos,
      },
    ],
  },

  XPRT: {
    name: 'Persistence',
    logo: 'xprt.png',
    coinGeckoId: 'persistence',

    ibcs: [
      {
        symbol: 'XPRT',
        decimals: 6,
        isNative: true,
        baseDenom: 'uxprt',
        path: 'transfer/channel-82',
        channelId: 'channel-82',
        hash: 'B786E7CBBF026F6F15A8DA248E0F18C62A0F7A70CB2DABD9239398C8B5150ABB',
        source: TokenSource.Cosmos,
      },
    ],
  },

  EVMOS: {
    name: 'Evmos',
    logo: 'evmos.png',
    coinGeckoId: 'evmos',

    ibcs: [
      {
        symbol: 'EVMOS',
        decimals: 18,
        isNative: true,
        baseDenom: 'aevmos',
        path: 'transfer/channel-83',
        channelId: 'channel-83',
        hash: '16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
        source: TokenSource.Cosmos,
      },
    ],
  },

  STX: {
    name: 'Stacks',
    symbol: 'STX',
    decimals: 6,
    logo: 'stacks.png',
    coinGeckoId: 'blockstack',
    tokenType: TokenType.Unknown,
  },

  DOT: {
    name: 'Polkadot',
    logo: 'dot.jpeg',
    coinGeckoId: 'polkadot',

    erc20: {
      symbol: 'DOT',
      decimals: 10,
      address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
    },

    ibcs: [
      {
        symbol: 'DOT',
        decimals: 10,
        isNative: false,
        baseDenom: 'dot-planck',
        path: 'transfer/channel-84',
        channelId: 'channel-84',
        hash: '624BA9DD171915A2B9EA70F69638B2CEA179959850C1A586F6C485498F29EDD4',
        source: TokenSource.Cosmos,
      },
    ],

    cw20s: [
      {
        symbol: 'DOT',
        decimals: 10,
        address: 'inj1spzwwtr2luljr300ng2gu52zg7wn7j44m92mdf',
      },
    ],
  },

  STRD: {
    name: 'Stride',
    logo: 'stride.png',
    coinGeckoId: 'stride',

    ibcs: [
      {
        symbol: 'STRD',
        decimals: 6,
        isNative: true,
        baseDenom: 'ustrd',
        path: 'transfer/channel-89',
        channelId: 'channel-89',
        hash: '3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
        source: TokenSource.Cosmos,
      },
    ],
  },

  CRE: {
    name: 'Crescent',
    logo: 'crescent.jpeg',
    coinGeckoId: 'crescent-network',

    ibcs: [
      {
        symbol: 'CRE',
        decimals: 6,
        isNative: true,
        baseDenom: 'ucre',
        path: 'transfer/channel-90',
        channelId: 'channel-90',
        hash: '3A6DD3358D9F7ADD18CDE79BA10B400511A5DE4AE2C037D7C9639B52ADAF35C6',
        source: TokenSource.Cosmos,
      },
    ],
  },

  ASTRO: {
    name: 'ASTRO',
    logo: 'astroport.png',
    coinGeckoId: 'astroport-fi',

    ibcs: [
      {
        symbol: 'ASTRO',
        decimals: 6,
        isNative: true,
        baseDenom:
          'cw20:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26',
        path: 'transfer/channel-104',
        channelId: 'channel-104',
        hash: 'EBD5A24C554198EBAF44979C5B4D2C2D312E6EBAB71962C92F735499C7575839',
        source: TokenSource.Cosmos,
      },
    ],
  },

  SOL: {
    name: 'Solana',
    logo: 'solana.png',
    coinGeckoId: 'solana',

    spl: {
      symbol: 'SOL',
      decimals: 9,
      address: '',
      isNative: true,
    },

    cw20s: [
      {
        name: 'Solana (legacy)',
        symbol: 'SOLlegacy',
        decimals: 8,
        address: 'inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
      },
    ],

    ibcs: [
      {
        symbol: 'SOL',
        decimals: 8,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/8sYgCzLRJC3J7qPn2bNbx6PiGcarhyx8rBhVaNnfvHCA',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: 'A8B0B746B5AB736C2D8577259B510D56B8AF598008F68041E3D634BCDE72BE97',
        source: TokenSource.Solana,
      },
    ],
  },

  SOMM: {
    name: 'Sommelier',
    logo: 'sommelier.png',
    coinGeckoId: 'sommelier',

    erc20: {
      symbol: 'SOMM',
      decimals: 6,
      address: '0xa670d7237398238DE01267472C6f13e5B8010FD1',
    },

    ibcs: [
      {
        symbol: 'SOMM',
        decimals: 6,
        isNative: true,
        baseDenom: 'usomm',
        path: 'transfer/channel-93',
        channelId: 'channel-93',
        hash: '34346A60A95EB030D62D6F5BDD4B745BE18E8A693372A8A347D5D53DBBB1328B',
        source: TokenSource.Cosmos,
      },
    ],
  },

  ETHBTCTREND: {
    name: 'ETHBTC Trend',
    logo: 'ethbtctrend.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'ETHBTCTrend',
      decimals: 18,
      address: '0x6b7f87279982d919Bbf85182DDeAB179B366D8f2',
    },
  },

  STEADYETH: {
    name: 'SteadyETH',
    logo: 'steadyeth.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'SteadyETH',
      decimals: 18,
      address: '0x3F07A84eCdf494310D397d24c1C78B041D2fa622',
    },
  },

  STEADYBTC: {
    name: 'SteadyBTC',
    logo: 'steadybtc.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'SteadyBTC',
      decimals: 18,
      address: '0x4986fD36b6b16f49b43282Ee2e24C5cF90ed166d',
    },
  },

  XPLA: {
    name: 'XPLA',
    logo: 'xpla.png',
    coinGeckoId: 'xpla',

    cw20s: [
      {
        symbol: 'XPLA',
        decimals: 8,
        address: 'inj1j08452mqwadp8xu25kn9rleyl2gufgfjqjvewe',
      },
    ],
  },

  AVAX: {
    name: 'AVAX',
    logo: 'avax.webp',
    coinGeckoId: 'avalanche-2',

    cw20s: [
      {
        symbol: 'AVAX',
        decimals: 8,
        address: 'inj18a2u6az6dzw528rptepfg6n49ak6hdzkny4um6',
      },
    ],
  },

  BONK: {
    name: 'BONK',
    logo: 'bonk.jpeg',
    coinGeckoId: 'bonk',

    cw20s: [
      {
        symbol: 'BONK',
        decimals: 5,
        address: 'inj14rry9q6dym3dgcwzq79yay0e9azdz55jr465ch',
      },
    ],
  },

  CHZ: {
    name: 'Chiliz',
    logo: 'chz.png',
    coinGeckoId: 'chiliz',

    erc20: {
      symbol: 'CHZ',
      decimals: 18,
      address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF',
    },

    cw20s: [
      {
        name: 'Chiliz (legacy)',
        symbol: 'CHZlegacy',
        decimals: 8,
        address: 'inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh',
      },
    ],
  },

  CANTO: {
    name: 'Canto',
    logo: 'canto.webp',
    coinGeckoId: 'canto',

    ibcs: [
      {
        symbol: 'CANTO',
        decimals: 18,
        isNative: true,
        baseDenom: 'acanto',
        path: 'transfer/channel-99',
        channelId: 'channel-99',
        hash: 'D91A2C4EE7CD86BBAFCE0FA44A60DDD9AFBB7EEB5B2D46C0984DEBCC6FEDFAE8',
        source: TokenSource.Cosmos,
      },
    ],
  },

  QAT: {
    name: 'Test QAT',
    logo: 'injective-v3.png',
    coinGeckoId: 'injective-protocol',

    erc20: {
      symbol: 'QAT',
      decimals: 18,
      address: '0x1902e18fEB1234D00d880f1fACA5C8d74e8501E9',
    },

    cw20s: [
      {
        symbol: 'QAT',
        decimals: 8,
        address: 'inj1m4g54lg2mhhm7a4h3ms5xlyecafhe4macgsuen',
      },
    ],
  },

  PUGGO: {
    name: 'Puggo',
    logo: 'puggo.jpg',
    coinGeckoId: '',

    erc20: {
      decimals: 18,
      symbol: 'PUG',
      address: '0xf9a06dE3F6639E6ee4F079095D5093644Ad85E8b',
    },
  },

  LDO: {
    name: 'Lido DAO Token',
    logo: 'lido-dao.webp',
    coinGeckoId: 'lido-dao',

    erc20: {
      symbol: 'LDO',
      decimals: 18,
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
    },

    cw20s: [
      {
        symbol: 'LDO',
        decimals: 8,
        address: 'inj1me6t602jlndzxgv2d7ekcnkjuqdp7vfh4txpyy',
      },
    ],
  },

  ARB: {
    name: 'Arbitrum',
    logo: 'arb-circle.png',
    coinGeckoId: 'arbitrum',

    evm: {
      symbol: 'ARB',
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    },

    erc20: {
      symbol: 'ARB',
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    },

    cw20s: [
      {
        name: 'Arbitrum (legacy)',
        symbol: 'ARBlegacy',
        decimals: 8,
        address: 'inj1d5vz0uzwlpfvgwrwulxg6syy82axa58y4fuszd',
        source: TokenSource.Arbitrum,
      },
    ],

    ibcs: [
      {
        decimals: 8,
        symbol: 'ARB',
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/4jq5m8FR6W6nJygDj8NMMbB48mqX4LQHc3j5uEb9syDe',
        isNative: false,
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '8CF0E4184CA3105798EDB18CAA3981ADB16A9951FE9B05C6D830C746202747E1',
        source: TokenSource.Arbitrum,
      },
    ],
  },

  EUR: {
    name: 'Euro',
    symbol: 'EUR',
    decimals: 6,
    logo: 'eur.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  GBP: {
    name: 'British Pound',
    symbol: 'GBP',
    decimals: 6,
    logo: 'gpb.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  JPY: {
    name: 'Japanese Yen',
    symbol: 'JPY',
    decimals: 6,
    logo: 'jpy.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  XAU: {
    name: 'Gold',
    symbol: 'XAU',
    decimals: 6,
    logo: 'gold.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  GOLD: {
    name: 'GOLD',
    symbol: 'GOLD',
    decimals: 18,
    logo: 'gold.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  BRZ: {
    name: 'Brazilian Digital Token',
    logo: 'brz.png',
    coinGeckoId: 'brz',

    erc20: {
      symbol: 'BRZ',
      decimals: 4,
      address: '0x420412E765BFa6d85aaaC94b4f7b708C89be2e2B',
    },

    cw20s: [
      {
        symbol: 'BRZ',
        decimals: 4,
        address: 'inj14jesa4q248mfxztfc9zgpswkpa4wx249mya9kk',
      },
    ],
  },

  ASTR: {
    name: 'Astar',
    logo: 'astar.png',
    coinGeckoId: 'astar',

    cw20s: [
      {
        symbol: 'ASTR',
        decimals: 18,
        address: 'inj1mhmln627samtkuwe459ylq763r4n7n69gxxc9x',
      },
    ],
  },

  ALPHA: {
    name: 'Alpha Coin',
    logo: 'alpha.png',
    coinGeckoId: 'alphacoin',

    erc20: {
      symbol: 'ALPHA',
      decimals: 18,
      address: '0x138C2F1123cF3f82E4596d097c118eAc6684940B',
    },

    cw20s: [
      {
        symbol: 'ALPHA',
        decimals: 8,
        address: 'inj1zwnsemwrpve3wrrg0njj89w6mt5rmj9ydkc46u',
      },
    ],
  },

  WMATIC: {
    name: 'Wrapped Matic',
    logo: 'polygon.png',
    coinGeckoId: 'wmatic',

    evm: {
      symbol: 'WMATIC',
      decimals: 18,
      isNative: true,
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    },

    cw20s: [
      {
        name: 'Wrapped Matic (legacy)',
        symbol: 'WMATIClegacy',
        decimals: 8,
        address: 'inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
        source: TokenSource.Polygon,
      },
    ],

    ibcs: [
      {
        decimals: 8,
        symbol: 'WMATIC',
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/4gn1J9pchUGh63ez1VwiuTmU4nfJ8Rr8o5HgBC5TMdMk',
        isNative: false,
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '4DEFEB42BAAB2788723759D95B7550BCE460855563ED977036248F5B94C842FC',
        source: TokenSource.Polygon,
      },
    ],
  },

  '1MPEPE': {
    name: 'Pepe',
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      symbol: 'MPEPE',
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    },
  },

  '1000PEPE': {
    name: 'Pepe',
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      symbol: 'KPEPE',
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    },
  },

  PEPE: {
    name: 'Pepe',
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',

    erc20: {
      symbol: 'PEPE',
      decimals: 18,
      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    },
  },

  WASSIE: {
    name: 'WASSIE',
    logo: 'wassie.jpeg',
    coinGeckoId: 'wassie',

    erc20: {
      symbol: 'WASSIE',
      decimals: 18,
      address: '0x2c95d751da37a5c1d9c5a7fd465c1d50f3d96160',
    },
  },

  RIBBIT: {
    name: 'Ribbit Meme',
    logo: 'ribbit.jpeg',
    coinGeckoId: 'ribbit-meme',

    erc20: {
      symbol: 'RIBBIT',
      decimals: 18,
      address: '0xb794Ad95317f75c44090f64955954C3849315fFe',
    },
  },

  LAMBO: {
    name: 'Lambo',
    logo: 'lambo.jpeg',
    coinGeckoId: 'lambo-0fcbf0f7-1a8f-470d-ba09-797d5e95d836',

    erc20: {
      symbol: 'LAMBO',
      decimals: 18,
      address: '0x3d2b66BC4f9D6388BD2d97B95b565BE1686aEfB3',
    },
  },

  STINJ: {
    name: 'Stride Staked Injective',
    logo: 'stinj.png',
    coinGeckoId: 'stride-staked-injective',

    ibcs: [
      {
        symbol: 'STINJ',
        decimals: 18,
        isNative: true,
        baseDenom: 'stinj',
        path: 'transfer/channel-89',
        channelId: 'channel-89',
        hash: 'AC87717EA002B0123B10A05063E69BCA274BA2C44D842AEEB41558D2856DCE93',
        source: TokenSource.Cosmos,
      },
    ],
  },

  XRP: {
    name: 'Ripple',
    logo: 'xrp.png',
    coinGeckoId: 'ripple',

    erc20: {
      symbol: 'XRP',
      decimals: 18,
      address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
    },
  },

  RAI: {
    name: 'Rai Reflex Index',
    logo: 'rai.png',
    coinGeckoId: 'rai',

    erc20: {
      symbol: 'RAI',
      decimals: 18,
      address: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
    },
  },

  BTSG: {
    name: 'Rai Reflex Index',
    logo: 'btsg.png',
    coinGeckoId: 'bitsong',

    erc20: {
      symbol: 'BitSong',
      decimals: 18,
      address: '0x05079687D35b93538cbd59fe5596380cae9054A9',
    },
  },

  CVR: {
    name: 'CoverCompared',
    logo: 'cvr.png',
    coinGeckoId: 'covercompared',

    erc20: {
      symbol: 'CVR',
      decimals: 18,
      address: '0x3c03b4ec9477809072ff9cc9292c9b25d4a8e6c6',
    },
  },

  QNT: {
    name: 'Quant',
    logo: 'qnt.png',
    coinGeckoId: 'quant-network',

    erc20: {
      symbol: 'QNT',
      decimals: 18,
      address: '0x4a220e6096b25eadb88358cb44068a3248254675',
    },
  },

  WSTETH: {
    name: 'Lido wstETH',
    logo: 'wsteth.png',
    coinGeckoId: 'wrapped-steth',

    erc20: {
      symbol: 'WSTETH',
      decimals: 18,
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    },
  },

  DYDX: {
    name: 'dYdX',
    logo: 'dydx.png',
    coinGeckoId: 'dydx',

    erc20: {
      symbol: 'dYdX',
      decimals: 18,
      address: '0x92d6c1e31e14520e676a687f0a93788b716beff5',
    },
  },

  XAC: {
    name: 'General Attention Currency',
    logo: 'xac.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'XAC',
      decimals: 8,
      address: '0xDe4C5a791913838027a2185709E98c5C6027EA63',
    },
  },

  STETH: {
    name: 'Lido Staked ETH',
    logo: 'steth.png',
    coinGeckoId: 'staked-ether',

    erc20: {
      symbol: 'stETH',
      decimals: 18,
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    },
  },

  LYM: {
    name: 'Lympo',
    logo: 'lympo.png',
    coinGeckoId: 'lympo',

    erc20: {
      symbol: 'LYM',
      decimals: 18,
      address: '0xc690f7c7fcffa6a82b79fab7508c466fefdfc8c5',
    },
  },

  OMI: {
    name: 'ECOMI',
    logo: 'omi.png',
    coinGeckoId: 'ecomi',

    erc20: {
      symbol: 'OMI',
      decimals: 18,
      address: '0xed35af169af46a02ee13b9d79eb57d6d68c1749e',
    },
  },

  POINT: {
    name: 'Reward Point Token',
    logo: 'point.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'POINT',
        creator: 'inj1zaem9jqplp08hkkd5vcl6vmvala9qury79vfj4',
        decimals: 0,
      },
    ],
  },

  KAVA: {
    name: 'KAVA',
    logo: 'kava.webp',
    coinGeckoId: 'kava',

    ibcs: [
      {
        symbol: 'KAVA',
        decimals: 6,
        isNative: true,
        baseDenom: 'ukava',
        path: 'transfer/channel-143',
        channelId: 'channel-143',
        hash: '57AA1A70A4BC9769C525EBF6386F7A21536E04A79D62E1981EFCEF9428EBB205',
        source: TokenSource.Cosmos,
      },
    ],
  },

  SEI: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 6,
    logo: 'sei.webp',
    coinGeckoId: 'sei-network',
    tokenType: TokenType.Unknown,
  },

  VATRENI: {
    name: 'Vatreni Token',
    logo: 'vatreni.jpeg',
    coinGeckoId: 'croatian-ff-fan-token',

    evm: {
      symbol: 'VATRENI',
      decimals: 18,
      isNative: true,
      address: '0xD60DebA014459F07BBcC077a5B817f31DaFD5229',
    },

    cw20s: [
      {
        symbol: 'VATRENI',
        decimals: 8,
        address: 'inj1tn457ed2gg5vj2cur5khjjw63w73y3xhyhtaay',
        source: TokenSource.Polygon,
      },
    ],
  },

  NBLA: {
    name: 'Nebula',
    logo: 'nebula.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        symbol: 'NBLA',
        creator: 'inj1d0zfq42409a5mhdagjutl8u6u9rgcm4h8zfmfq',
        decimals: 6,
      },
    ],
  },

  WKLAY: {
    name: 'Wrapped Klaytn',
    logo: 'klaytn.webp',
    coinGeckoId: 'klay-token',

    cw20s: [
      {
        symbol: 'WKLAY',
        decimals: 8,
        address: 'inj14cl67lprqkt3pncjav070gavaxslc0tzpc56f4',
      },
    ],
  },

  NEOK: {
    name: 'NEOKingdom DAO',
    logo: 'neok.png',
    coinGeckoId: '',

    ibcs: [
      {
        symbol: 'NEOK',
        decimals: 18,
        isNative: true,
        baseDenom: 'erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9',
        path: 'transfer/channel-83',
        channelId: 'channel-83',
        hash: 'F6CC233E5C0EA36B1F74AB1AF98471A2D6A80E2542856639703E908B4D93E7C4',
        source: TokenSource.Cosmos,
      },
    ],
  },

  ORAI: {
    name: 'Oraichain',
    logo: 'orai.png',
    coinGeckoId: 'oraichain-token',

    erc20: {
      symbol: 'ORAI',
      decimals: 18,
      address: '0x4c11249814f11b9346808179Cf06e71ac328c1b5',
    },

    ibcs: [
      {
        symbol: 'ORAI',
        decimals: 6,
        isNative: true,
        baseDenom: 'orai',
        path: 'transfer/channel-147',
        channelId: 'channel-147',
        hash: 'C20C0A822BD22B2CEF0D067400FCCFB6FAEEE9E91D360B4E0725BD522302D565',
        source: TokenSource.Cosmos,
      },
    ],
  },

  EVINDEX: {
    name: 'EVIINDEX',
    symbol: 'EVIINDEX',
    decimals: 18,
    logo: 'truEVINDEX.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  TRUCPI: {
    name: 'TRUCPI',
    symbol: 'TRUCPI',
    decimals: 18,
    logo: 'truflation.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  TIA: {
    name: 'Celestia',
    logo: 'tia.webp',
    coinGeckoId: 'celestia',

    ibcs: [
      {
        symbol: 'TIA',
        decimals: 6,
        isNative: true,
        baseDenom: 'utia',
        path: 'transfer/channel-152',
        channelId: 'channel-152',
        hash: 'F51BB221BAA275F2EBF654F70B005627D7E713AFFD6D86AFD1E43CAA886149F4',
        source: TokenSource.Cosmos,
      },
    ],
  },

  TALIS: {
    name: 'Talis',
    logo: 'talis.webp',
    coinGeckoId: 'talis-protocol',

    tokenFactories: [
      {
        creator: 'inj1maeyvxfamtn8lfyxpjca8kuvauuf2qeu6gtxm3',
        symbol: 'TALIS',
        decimals: 6,
      },
    ],
  },

  XTALIS: {
    name: 'xTalis',
    logo: 'xtalis.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1maeyvxfamtn8lfyxpjca8kuvauuf2qeu6gtxm3',
        symbol: 'XTALIS',
        decimals: 6,
      },
    ],
  },

  KIRA: {
    name: 'KIRA',
    logo: 'kira.jpeg',
    coinGeckoId: 'kira-the-injective-cat',

    tokenFactories: [
      {
        creator: 'inj1xy3kvlr4q4wdd6lrelsrw2fk2ged0any44hhwq',
        symbol: 'KIRA',
        decimals: 6,
      },
    ],
  },

  USDY: {
    name: 'Ondo US Dollar Yield',
    logo: 'usdy.webp',
    coinGeckoId: 'ondo-us-dollar-yield',

    erc20: {
      symbol: 'USDY',
      decimals: 18,
      address: '0x96F6eF951840721AdBF46Ac996b59E0235CB985C',
    },
  },

  KUJI: {
    name: 'Kujira',
    logo: 'kuji.webp',
    coinGeckoId: 'kujira',

    ibcs: [
      {
        symbol: 'KUJI',
        decimals: 6,
        isNative: true,
        baseDenom: 'ukuji',
        path: 'transfer/channel-98',
        channelId: 'channel-98',
        hash: '9A115B56E769B92621FFF90567E2D60EFD146E86E867491DB69EEDA9ADC36204',
        source: TokenSource.Cosmos,
      },
    ],
  },

  'USDC-MPL': {
    name: 'USDC Maple',
    logo: 'usdc-mpl.jpeg',
    coinGeckoId: '',

    erc20: {
      symbol: 'USDC-MPL',
      decimals: 6,
      address: '0xf875aef00C4E21E9Ab4A335eB36A1175Ab00424A',
    },
  },

  PYTH: {
    name: 'Pyth Network',
    logo: 'pyth.png',
    coinGeckoId: 'pyth-network',

    spl: {
      decimals: 6,
      symbol: 'PYTH',
      isNative: false,
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
    },

    cw20s: [
      {
        name: 'Pyth Network (legacy)',
        decimals: 6,
        symbol: 'PYTHlegacy',
        source: TokenSource.Solana,
        address: 'inj1tjcf9497fwmrnk22jfu5hsdq82qshga54ajvzy',
      },
    ],

    ibcs: [
      {
        symbol: 'PYTH',
        decimals: 6,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/B8ohBnfisop27exk2gtNABJyYjLwQA7ogrp5uNzvZCoy',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: 'F3330C1B8BD1886FE9509B94C7B5398B892EA41420D2BC0B7C6A53CB8ED761D6',
        source: TokenSource.Solana,
      },
    ],
  },

  TIX: {
    name: 'Timeworx.io',
    logo: 'tix.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1rw3qvamxgmvyexuz2uhyfa4hukvtvteznxjvke' /** testnet */,
        symbol: 'TIX',
        decimals: 6,
      },
    ],
  },

  NINJ: {
    name: 'Gryphon Staked Injective',
    logo: 'ninj.png',
    coinGeckoId: '',

    cw20s: [
      {
        decimals: 18,
        symbol: 'nINJ',
        address: 'inj13xlpypcwl5fuc84uhqzzqumnrcfpptyl6w3vrf',
      },
    ],
  },

  BINJ: {
    tokenFactories: [
      {
        name: 'blackINJ',
        logo: 'blackINJ.png',
        coinGeckoId: '',
        creator: 'inj10q36ygr0pkz7ezajcnjd2f0tat5n737yg6g6d5',
        symbol: 'bINJ',
        decimals: 18,
      },
      {
        name: 'Bird INJ',
        logo: 'bird.png',
        creator: 'inj125hcdvz9dnhdqal2u8ctr7l0hd8xy9wdgzt8ld',
        symbol: 'BINJ',
        coinGeckoId: '',
        decimals: 6,
      },
      {
        name: 'Bird INJ',
        logo: 'bird.png',
        creator: 'inj1lhr06p7k3rdgk0knw5hfsde3fj87g2aq4e9a52',
        symbol: 'BINJ',
        coinGeckoId: '',
        decimals: 6,
      },
    ],
  },

  NINJA: {
    name: 'Dog Wif Nunchucks',
    logo: 'ninja.png',
    coinGeckoId: 'dog-wif-nuchucks',

    tokenFactories: [
      {
        creator: 'inj1xtel2knkt8hmc9dnzpjz6kdmacgcfmlv5f308w',
        symbol: 'NINJA',
        decimals: 6,
      },
    ],
  },

  KATANA: {
    name: 'Dog Wif Katana',
    logo: 'katana.webp',
    coinGeckoId: 'dogwifkatana',

    tokenFactories: [
      {
        creator: 'inj1vwn4x08hlactxj3y3kuqddafs2hhqzapruwt87',
        symbol: 'KATANA',
        decimals: 6,
      },
    ],
  },

  GALAXY: {
    name: 'GALAXY',
    logo: 'galaxy.webp',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj10zdjt8ylfln5xr3a2ruf9nwn6d5q2d2r3v6mh8',
        symbol: 'GALAXY',
        decimals: 6,
      },
    ],
  },

  AOI: {
    name: 'Alien Token',
    logo: 'aoi.webp',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj169ed97mcnf8ay6rgvskn95n6tyt46uwvy5qgs0',
        symbol: '$AOI',
        decimals: 6,
      },
    ],
  },

  NOBI: {
    name: 'Shinobi',
    logo: 'nobi.webp',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1pjp9q2ycs7eaav8d5ny5956k5m6t0alpl33xd6',
        symbol: 'NOBI',
        decimals: 6,
      },
      {
        creator: 'inj1t02au5gsk40ev9jaq0ggcyry9deuvvza6s4wav',
        symbol: 'NOBI',
        decimals: 6,
      },
      {
        creator: 'inj1xawhm3d8lf9n0rqdljpal033yackja3dt0kvp0',
        symbol: 'NOBI',
        decimals: 6,
      },
    ],
  },

  YUKI: {
    name: 'Yuki Dog',
    logo: 'yuki.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1spdy83ds5ezq9rvtg0ndy8480ad5rlczcpvtu2',
        symbol: 'YUKI',
        decimals: 6,
      },
    ],
  },

  WAGMI: {
    name: 'Wagmi Coin',
    logo: 'wagmi.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj188veuqed0dygkcmq5d24u3807n6csv4wdv28gh',
        symbol: 'WAGMI',
        decimals: 9,
      },
    ],
  },

  BAMBOO: {
    name: 'Injective Panda',
    logo: 'panda.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj144nw6ny28mlwuvhfnh7sv4fcmuxnpjx4pksr0j',
        symbol: 'BAMBOO',
        decimals: 6,
      },
      {
        creator: 'inj183lz632dna57ayuf6unqph5d0v2u655h2jzzyy',
        symbol: 'BAMBOO',
        decimals: 6,
      },
    ],
  },

  SHURIKEN: {
    name: 'Shuriken Token',
    logo: 'shuriken.jpeg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1z426atp9k68uv49kaam7m0vnehw5fulxkyvde0',
        symbol: 'SHURIKEN',
        decimals: 6,
      },
      {
        creator: 'inj1kt6ujkzdfv9we6t3ca344d3wquynrq6dg77qju',
        symbol: 'SHURIKEN',
        decimals: 6,
      },
      {
        creator: 'inj1gflhshg8yrk8rrr3sgswhmsnygw9ghzdsn05a0',
        symbol: 'SHURIKEN',
        decimals: 6,
      },
    ],
  },

  BRETT: {
    name: 'BluePepe',
    logo: 'brett.jpeg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj13jjdsa953w03dvecsr43dj5r6a2vzt7n0spncv',
        symbol: 'BRETT',
        decimals: 6,
      },
    ],
  },

  ZIG: {
    name: 'ZigCoin',
    logo: 'zigg.png',
    coinGeckoId: 'zignaly',

    erc20: {
      symbol: 'ZIG',
      decimals: 18,
      address: '0xb2617246d0c6c0087f18703d576831899ca94f01',
    },
  },

  DOJ: {
    name: 'DOJcoin',
    logo: 'doj.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj172ccd0gddgz203e4pf86ype7zjx573tn8g0df9',
        symbol: 'DOJ',
        decimals: 6,
      },
    ],
  },

  SKIPBIDIDOBDOBDOBYESYESYESYES: {
    name: 'SKIPBIDIDOBDOBDOBYESYESYESYES',
    logo: 'skibidi.jpeg',
    coinGeckoId: '',

    erc20: {
      symbol: 'SKIPBIDIDOBDOBDOBYESYESYESYES',
      decimals: 9,
      address: '0x5085202d0A4D8E4724Aa98C42856441c3b97Bc6d',
    },
  },

  GINGER: {
    name: 'GINGER',
    logo: 'ginger.png',
    coinGeckoId: 'ginger',

    tokenFactories: [
      {
        creator: 'inj172ccd0gddgz203e4pf86ype7zjx573tn8g0df9',
        symbol: 'GINGER',
        decimals: 6,
      },
    ],
  },

  ERIC: {
    name: 'TheJanitor',
    logo: 'eric.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1w7cw5tltax6dx7znehul98gel6yutwuvh44j77',
        symbol: 'ERIC',
        decimals: 6,
      },
    ],
  },

  INJINU: {
    name: 'INJINU',
    logo: 'injinu.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1vjppa6h9lf75pt0v6qnxtej4xcl0qevnxzcrvm',
        symbol: 'INJINU',
        decimals: 6,
      },
    ],
  },

  Babykira: {
    name: 'Babykira',
    logo: 'babykira.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj13vau2mgx6mg7ams9nngjhyng58tl9zyw0n8s93',
        symbol: '$Babykira',
        decimals: 6,
      },
      {
        creator: 'inj15jeczm4mqwtc9lk4c0cyynndud32mqd4m9xnmu',
        symbol: '$Babykira',
        decimals: 6,
      },
    ],
  },

  LIOR: {
    name: 'LIOR',
    logo: 'lior.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1cjus5ragdkvpmt627fw7wkj2ydsra9s0vap4zx',
        symbol: 'LIOR',
        decimals: 6,
      },
      {
        creator: 'inj1sg3yjgjlwhtrepeuusj4jwv209rh6cmk882cw3',
        symbol: 'LIOR',
        decimals: 6,
      },
      {
        creator: 'inj1tgphgjqsz8fupkfjx6cy275e3s0l8xfu6rd6jh',
        symbol: 'LIOR',
        decimals: 6,
      },
    ],
  },

  INJER: {
    name: 'INJINEER',
    logo: 'INJINEER.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1sjmplasxl9zgj6yh45j3ndskgdhcfcss9djkdn',
        symbol: 'INJER',
        decimals: 6,
      },
    ],
  },

  SHIBA: {
    name: 'Shiba',
    logo: 'shiba.webp',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1v0yk4msqsff7e9zf8ktxykfhz2hen6t2u4ue4r',
        symbol: 'Shiba INJ',
        decimals: 6,
      },
    ],
  },

  GROK: {
    name: 'GROK',
    logo: 'grok.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1vgrf5mcvvg9p5c6jajqefn840nq74wjzgkt30z',
        symbol: 'GROK',
        decimals: 6,
      },
    ],
  },

  SNOWY: {
    name: 'Injective Snowy',
    logo: 'snowy.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1ml33x7lkxk6x2x95d3alw4h84evlcdz2gnehmk',
        symbol: 'SNOWY',
        decimals: 6,
      },
    ],
  },

  BULLS: {
    name: 'BULLS',
    logo: 'bulls.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1zq37mfquqgud2uqemqdkyv36gdstkxl27pj5e3',
        symbol: 'BULLS',
        decimals: 6,
      },
    ],
  },

  LVN: {
    name: 'Levana',
    coinGeckoId: 'levana-protocol',
    logo: 'lvn.png',

    ibcs: [
      {
        symbol: 'LVN',
        decimals: 6,
        isNative: false,
        baseDenom: 'ulvn',
        path: 'transfer/channel-8',
        channelId: 'channel-8',
        hash: '4971C5E4786D5995EC7EF894FCFA9CF2E127E95D5D53A982F6A062F3F410EDB8',
        source: TokenSource.Cosmos,
      },
    ],
  },

  KINJA: {
    name: 'Kinja',
    logo: 'kinja.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1h33jkaqqalcy3wf8um6ewk4hxmfwf8uern470k',
        symbol: 'KINJA',
        decimals: 6,
      },
    ],
  },

  LAMA: {
    name: 'LAMA',
    logo: 'lama.webp',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj18lh8zx4hx0pyksyu74srktv4vgxskkkafknggl',
        symbol: 'LAMA',
        decimals: 6,
      },
    ],
  },

  INJEX: {
    name: 'Internet Explorer',
    logo: 'injex.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1zhevrrwywg3az9ulxd9u233eyy4m2mmr6vegsg',
        symbol: 'NINJB',
        decimals: 6,
      },
    ],
  },

  NINJB: {
    name: 'NINJB',
    logo: 'ninjb.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1ezzzfm2exjz57hxuc65sl8s3d5y6ee0kxvu67n',
        symbol: 'NINJB',
        decimals: 6,
      },
    ],
  },

  KARATE: {
    name: 'Doge Wif Karate',
    logo: 'karate.jpg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1898t0vtmul3tcn3t0v8qe3pat47ca937jkpezv',
        symbol: 'KARATE',
        decimals: 6,
      },
    ],
  },

  NPEPE: {
    name: 'NinjaPepe',
    logo: 'npepe.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1ga982yy0wumrlt4nnj79wcgmw7mzvw6jcyecl0',
        symbol: 'NPEPE',
        decimals: 6,
      },
    ],
  },

  MILK: {
    name: 'MILK',
    logo: 'milk.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1fpl63h7at2epr55yn5svmqkq4fkye32vmxq8ry',
        symbol: 'MILK',
        decimals: 6,
      },
      {
        creator: 'inj1yg24mn8enl5e6v4jl2j6cce47mx4vyd6e8dpck',
        symbol: 'MILK',
        decimals: 6,
      },
    ],
  },

  INCEL: {
    name: 'InjectiveCelestiaNoFapLadyBoy420Inu',
    logo: 'incel.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj17g4j3geupy762u0wrewqwprvtzar7k5et2zqsh',
        symbol: 'INCEL',
        decimals: 6,
      },
    ],
  },

  PIKACHU: {
    name: 'Pikachu',
    logo: 'pikachu.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1h9zu2u6yqf3t5uym75z94zsqfhazzkyg39957u',
        symbol: 'PIKA',
        decimals: 6,
      },
      {
        creator: 'inj1h4usvhhva6dgmun9rk4haeh8lynln7yhk6ym00',
        symbol: 'PIKA',
        decimals: 6,
      },
    ],
  },

  WGMI: {
    name: 'WGMI',
    logo: 'wgmi.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1rmjzj9fn47kdmfk4f3z39qr6czexxe0yjyc546',
        symbol: 'WGMI',
        decimals: 6,
      },
    ],
  },

  WIZZ: {
    name: 'WIZZ',
    logo: 'wizz.jpeg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1uvfpvnmuqhx8jwg4786y59tkagmph827h38mst',
        symbol: 'WIZZ',
        decimals: 6,
      },
    ],
  },

  MEMEME: {
    name: 'Mememe',
    logo: 'meme.png',
    coinGeckoId: 'mememe',

    erc20: {
      symbol: 'MEMEME',
      decimals: 18,
      address: '0x1A963Df363D01EEBB2816b366d61C917F20e1EbE',
    },
  },

  MAGA: {
    name: 'Trump',
    logo: 'maga.png',
    coinGeckoId: 'maga',

    erc20: {
      symbol: 'MAGA',
      decimals: 9,
      address: '0x576e2BeD8F7b46D34016198911Cdf9886f78bea7',
    },
  },

  SDEX: {
    name: 'SmarDex',
    logo: 'maga.png',
    coinGeckoId: 'smardex',

    erc20: {
      symbol: 'SDEX',
      decimals: 18,
      address: '0x5DE8ab7E27f6E7A1fFf3E5B337584Aa43961BEeF',
    },
  },

  OX: {
    name: 'Open Exchange Token',
    logo: 'ox.png',
    coinGeckoId: 'open-exchange-token',

    erc20: {
      symbol: 'OX',
      decimals: 18,
      address: '0x78a0A62Fba6Fb21A83FE8a3433d44C73a4017A6f',
    },
  },

  FUSDT: {
    name: 'Flux USDT',
    logo: 'flux.png',
    coinGeckoId: 'flux-usdt',

    erc20: {
      symbol: 'fUSDT',
      decimals: 8,
      address: '0x81994b9607e06ab3d5cF3AffF9a67374f05F27d7',
    },
  },

  PVP: {
    name: 'PVP',
    logo: 'unknown.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'PVP',
      decimals: 8,
      address: '0x9B44793a0177C84DD01AD81137db696531902871',
    },
  },

  POOR: {
    name: 'Proof Of Officially Rugged',
    logo: 'unknown.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'POOR',
      decimals: 8,
      address: '0x9D433Fa992C5933D6843f8669019Da6D512fd5e9',
    },
  },

  VRD: {
    name: 'Viridis Network',
    logo: 'vrd.png',
    coinGeckoId: 'viridis-network',

    erc20: {
      symbol: 'VRD',
      decimals: 18,
      address: '0xf25304e75026E6a35FEDcA3B0889aE5c4D3C55D8',
    },
  },

  NONE: {
    name: 'None Trading',
    logo: 'none.webp',
    coinGeckoId: 'none-trading',

    erc20: {
      symbol: 'NONE',
      decimals: 18,
      address: '0x903ff0ba636E32De1767A4B5eEb55c155763D8B7',
    },
  },

  DUDE: {
    name: 'DUDE',
    logo: 'dude.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1sn34edy635nv4yhts3khgpy5qxw8uey6wvzq53',
        symbol: 'DUDE',
        decimals: 6,
      },
    ],
  },

  AUTISM: {
    name: 'AUTISM',
    logo: 'autism.png',
    coinGeckoId: 'autism',

    tokenFactories: [
      {
        creator: 'inj14lf8xm6fcvlggpa7guxzjqwjmtr24gnvf56hvz',
        symbol: 'AUTISM',
        decimals: 6,
      },
    ],
  },

  EXTRAVIRGINOLIVEINU: {
    name: 'Extra Virgin Olive Inu',
    logo: 'extravirginoliveinu.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj14n8f39qdg6t68s5z00t4vczvkcvzlgm6ea5vk5',
        symbol: 'NOBITCHES',
        decimals: 6,
      },
    ],
  },

  MILA: {
    name: 'MILA',
    logo: 'mila.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1z08usf75ecfp3cqtwey6gx7nr79s3agal3k8xf',
        symbol: 'MILA',
        decimals: 6,
      },
    ],
  },

  IPDAI: {
    name: 'Injective Panda AI',
    logo: 'ipdai.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1y3g4wpgnc4s28gd9ure3vwm9cmvmdphml6mtul',
        symbol: 'IPandaAI',
        decimals: 6,
      },
    ],
  },

  COCK: {
    name: 'ROOSTER NINJA',
    logo: 'cock.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1eucxlpy6c387g5wrn4ee7ppshdzg3rh4t50ahf',
        symbol: 'COCK',
        decimals: 6,
      },
    ],
  },

  MOONIFY: {
    name: 'Moonify',
    logo: 'moonify.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1ktq0gf7altpsf0l2qzql4sfs0vc0ru75cnj3a6',
        symbol: 'MOONIFY',
        decimals: 6,
      },
    ],
  },

  KARMAINJ: {
    name: 'Karma',
    logo: 'karma.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1d4ld9w7mf8wjyv5y7fnhpate07fguv3s3tmngm',
        symbol: 'KARMA',
        decimals: 6,
      },
    ],
  },

  DREAM: {
    name: 'DREAM',
    logo: 'DREAM.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1l2kcs4yxsxe0c87qy4ejmvkgegvjf0hkyhqk59',
        symbol: 'DREAM',
        decimals: 6,
      },
    ],
  },

  DGNZ: {
    name: 'Injective Degens',
    logo: 'DGNZ.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1l2kcs4yxsxe0c87qy4ejmvkgegvjf0hkyhqk59',
        symbol: 'DGNZ',
        decimals: 6,
      },
    ],
  },

  INJECT: {
    name: 'Injectools',
    logo: 'INJECT.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1j7zt6g03vpmg9p7g7qngvylfxqeuds73utsjnk',
        symbol: 'INJECT',
        decimals: 6,
      },
    ],
  },

  WAIFU: {
    name: 'Waifu',
    logo: 'waifu-logo.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj12dvzf9tx2ndc9498aqpkrxgugr3suysqwlmn49',
        symbol: 'WAIFU',
        decimals: 6,
      },
    ],
  },

  APP: {
    name: 'Moon App',
    logo: 'app.jpeg',
    coinGeckoId: 'moon-app',

    erc20: {
      symbol: 'APP',
      decimals: 18,
      address: '0xC5d27F27F08D1FD1E3EbBAa50b3442e6c0D50439',
    },
  },

  DOJO: {
    name: 'Dojo Token',
    logo: 'dojo-token.png',

    cw20s: [
      {
        coinGeckoId: 'dojo-token',
        symbol: 'DOJO',
        name: 'Dojo Token',
        decimals: 18,
        address: 'inj1zdj9kqnknztl2xclm5ssv25yre09f8908d4923',
      },
    ],

    tokenFactories: [
      {
        decimals: 6,
        symbol: 'DOJO',
        name: 'Dojo Bot',
        logo: 'dojo.png',
        creator: 'inj1any4rpwq7r850u6feajg5payvhwpunu9cxqevc',
      },
    ],
  },

  PUNK: {
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'PUNK',
        name: 'Punk Token',
        decimals: 18,
        logo: 'punk-token.webp',
        address: 'inj1wmrzttj7ms7glplek348vedx4v2ls467n539xt',
      },
    ],

    tokenFactories: [
      {
        name: 'Punk DAO Token',
        logo: 'PUNK.png',
        creator: 'inj1esz96ru3guug4ctmn5chjmkymt979sfvufq0hs',
        symbol: 'PUNK',
        decimals: 6,
      },
    ],
  },

  ORNE: {
    name: 'ORNE',
    logo: 'orne.png',
    coinGeckoId: 'orne',

    ibcs: [
      {
        symbol: 'ORNE',
        decimals: 6,
        isNative: true,
        baseDenom:
          'cw20:terra19p20mfnvwh9yvyr7aus3a6z6g6uk28fv4jhx9kmnc2m7krg27q2qkfenjw',
        path: 'transfer/channel-116',
        channelId: 'channel-116',
        hash: '3D99439444ACDEE71DBC4A774E49DB74B58846CCE31B9A868A7A61E4C14D321E',
        source: TokenSource.Cosmos,
      },
    ],
  },

  DROGO: {
    name: 'DROGO',
    logo: 'drogo.png',

    ibcs: [
      {
        symbol: 'DROGO',
        decimals: 6,
        isNative: true,
        baseDenom:
          'cw20:terra1cl273523kmr2uwjhhznq54je69mted2u3ljffm8kp2ap4z3drdksftwqun',
        path: 'transfer/channel-118',
        channelId: 'channel-118',
        hash: '565FE65B82C091F8BAD1379FA1B4560C036C07913355ED4BD8D156DA63F43712',
        source: TokenSource.Cosmos,
      },
    ],
  },

  RAMEN: {
    name: 'Ramen',
    logo: 'ramen.jpeg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1z5utcc5u90n8a5m8gv30char6j4hdzxz6t3pke',
        symbol: 'RAMEN',
        decimals: 6,
      },
    ],
  },

  GYEN: {
    name: 'GMO JPY',
    logo: 'gyen.webp',
    coinGeckoId: 'gyen',

    erc20: {
      symbol: 'GYEN',
      decimals: 6,
      address: '0xC08512927D12348F6620a698105e1BAac6EcD911',
    },
  },

  ZRO: {
    name: 'LayerZero',
    logo: 'zro.jpeg',
    decimals: 6,
    symbol: 'ZRO',
    coinGeckoId: 'layerzero',
    tokenType: TokenType.Unknown,
  },

  JUP: {
    name: 'Jupiter',
    logo: 'jup.jpeg',
    decimals: 6,
    symbol: 'JUP',
    coinGeckoId: 'jupiter-exchange-solana',
    tokenType: TokenType.Unknown,
  },

  ALIEN: {
    name: 'ALIEN',
    logo: 'alien.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1mly2ykhf6f9tdj58pvndjf4q8dzdl4myjqm9t6',
        symbol: '$ALIEN',
        decimals: 6,
      },
    ],
  },

  RICE: {
    name: 'RICE',
    logo: 'RICE.jpeg',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1mt876zny9j6xae25h7hl7zuqf7gkx8q63k0426',
        symbol: 'RICE',
        decimals: 12,
      },
    ],
  },

  BITS: {
    name: 'bits',
    logo: 'bits.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj10gcvfpnn4932kzk56h5kp77mrfdqas8z63qr7n',
        symbol: 'BITS',
        decimals: 6,
      },
    ],
  },

  WOSMO: {
    name: 'Wosmo',
    logo: 'WOSMO.png',
    coinGeckoId: '',

    ibcs: [
      {
        symbol: 'WOSMO',
        decimals: 6,
        isNative: true,
        baseDenom: 'factory/osmo1pfyxruwvtwk00y8z06dh2lqjdj82ldvy74wzm3/WOSMO',
        path: 'transfer/channel-8',
        channelId: 'channel-8',
        hash: 'DD648F5D3CDA56D0D8D8820CF703D246B9FC4007725D8B38D23A21FF1A1477E3',
        source: TokenSource.Cosmos,
      },
    ],
  },

  IKINGS: {
    name: 'Injective Kings',
    logo: 'IKINGS.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1mt876zny9j6xae25h7hl7zuqf7gkx8q63k0426',
        symbol: 'IKINGS',
        decimals: 6,
      },
    ],
  },

  BEAST: {
    name: 'Gelotto BEAST',
    logo: 'beast.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'BEAST',
      decimals: 6,
      address: '0xA4426666addBE8c4985377d36683D17FB40c31Be',
    },
  },

  GLTO: {
    name: 'Gelotto',
    logo: 'GLTO.png',
    coinGeckoId: '',

    erc20: {
      symbol: 'GLTO',
      decimals: 6,
      address: '0xd73175f9eb15eee81745d367ae59309Ca2ceb5e2',
    },
  },

  SUI: {
    name: 'Sui',
    logo: 'sui.webp',
    decimals: 9,
    symbol: 'SUI',
    coinGeckoId: 'sui',
    tokenType: TokenType.Unknown,
  },

  WIF: {
    name: 'dogwifhat',
    logo: 'wif.webp',
    decimals: 6,
    symbol: 'WIF',
    coinGeckoId: 'dogwifcoin',
    tokenType: TokenType.Unknown,
  },

  OP: {
    name: 'Optimism',
    logo: 'optimism.webp',
    decimals: 18,
    symbol: 'OP',
    coinGeckoId: 'optimism',
    tokenType: TokenType.Unknown,
  },

  DOGE: {
    name: 'Dogecoin',
    logo: 'dogecoin.webp',
    decimals: 8,
    symbol: 'DOGE',
    coinGeckoId: 'dogecoin',
    tokenType: TokenType.Unknown,
  },

  ANDR: {
    name: 'Andromeda',
    logo: 'andromeda.webp',
    coinGeckoId: 'andromeda-2',

    ibcs: [
      {
        symbol: 'ANDR',
        decimals: 6,
        isNative: true,
        baseDenom: 'uandr',
        path: 'transfer/channel-213',
        channelId: 'channel-213',
        hash: '61FA42C3F0B0F8768ED2CE380EDD3BE0E4CB7E67688F81F70DE9ECF5F8684E1E',
        source: TokenSource.Cosmos,
      },
    ],
  },

  hINJ: {
    name: 'Hydro Wrapped INJ',
    logo: 'hinj.svg',
    symbol: 'hINJ',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'hINJ',
        decimals: 18,
        address: 'inj18luqttqyckgpddndh8hvaq25d5nfwjc78m56lc',
      },
    ],
  },

  QUNT: {
    name: 'QUNT',
    logo: 'qunt.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj127l5a2wmkyvucxdlupqyac3y0v6wqfhq03ka64',
        symbol: 'QUNT',
        decimals: 6,
      },
    ],
  },

  HDRO: {
    name: 'Hydro',
    logo: 'hydro.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1pk7jhvjj2lufcghmvr7gl49dzwkk3xj0uqkwfk',
        symbol: 'HDRO',
        decimals: 6,
      },
      {
        creator: 'inj1etz0laas6h7vemg3qtd67jpr6lh8v7xz7gfzqw',
        symbol: 'HDRO',
        decimals: 6,
      },
      {
        creator: 'inj1etz0laas6h7vemg3qtd67jpr6lh8v7xz7gfzqw',
        symbol: 'HDRO',
        decimals: 6,
      },
    ],
  },

  DINJ: {
    name: 'Dojo Staked INJ',
    logo: 'dinj.svg',
    symbol: 'dINJ',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'dINJ',
        decimals: 18,
        address: 'inj134wfjutywny9qnyux2xgdmm0hfj7mwpl39r3r9',
      },
    ],
  },

  BMOS: {
    name: 'BMOS',
    logo: 'bitmos.png',
    coinGeckoId: '',

    ibcs: [
      {
        symbol: 'BMOS',
        decimals: 6,
        isNative: true,
        baseDenom:
          'cw20:terra1sxe8u2hjczlekwfkcq0rs28egt38pg3wqzfx4zcrese4fnvzzupsk9gjkq',
        path: 'transfer/channel-104',
        channelId: 'channel-104',
        hash: 'D9353C3B1407A7F7FE0A5CCB7D06249B57337888C95C6648AEAF2C83F4F3074E',
        source: TokenSource.Cosmos,
      },
    ],
  },

  XNJ: {
    name: 'xNinja.Tech Token',
    logo: 'xnj.png',
    symbol: 'XNJ',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'XNJ',
        decimals: 18,
        address: 'inj17pgmlk6fpfmqyffs205l98pmnmp688mt0948ar',
      },
    ],
  },

  USDE: {
    name: 'Ethena USDe',
    logo: 'usde.png',
    coinGeckoId: 'ethena-usde',

    erc20: {
      symbol: 'USDe',
      decimals: 18,
      address: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    },
  },

  KAGE: {
    name: 'Kage',
    coinGeckoId: 'kage',

    cw20s: [
      {
        symbol: 'KAGE',
        logo: 'kage.png',
        address: 'inj1l49685vnk88zfw2egf6v65se7trw2497wsqk65',
        decimals: 18,
      },
    ],
  },

  blackINJ: {
    name: 'blackINJ',
    logo: 'blackINJ.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj10q36ygr0pkz7ezajcnjd2f0tat5n737yg6g6d5',
        symbol: 'bINJ',
        decimals: 18,
      },
    ],
  },

  INJX: {
    name: 'Injex Finance',
    logo: 'injx.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj104h3hchl7ws8lp78zpvrunvsjdwfjc02r5d0fp',
        symbol: 'INJX',
        decimals: 6,
      },
    ],
  },

  nINJ: {
    name: 'Neptune Receipt INJ',
    logo: 'neptinj.png',
    symbol: 'nINJ',

    cw20s: [
      {
        symbol: 'nINJ',
        logo: 'neptinj.png',
        address: 'inj1rmzufd7h09sqfrre5dtvu5d09ta7c0t4jzkr2f',
        decimals: 18,
      },
    ],
  },

  nATOM: {
    name: 'Neptune Receipt ATOM',
    logo: 'natom.png',
    symbol: 'nATOM',

    cw20s: [
      {
        symbol: 'nATOM',
        logo: 'natom.png',
        address: 'inj16jf4qkcarp3lan4wl2qkrelf4kduvvujwg0780',
        decimals: 6,
      },
    ],
  },

  nUSDT: {
    name: 'Neptune Receipt USDT',
    logo: 'nusdt.png',
    symbol: 'nUSDT',

    cw20s: [
      {
        symbol: 'nUSDT',
        logo: 'nusdt.png',
        address: 'inj1cy9hes20vww2yr6crvs75gxy5hpycya2hmjg9s',
        decimals: 6,
      },
    ],
  },

  nWETH: {
    name: 'Neptune Receipt WETH',
    logo: 'nweth.png',
    symbol: 'nWETH',

    cw20s: [
      {
        symbol: 'nWETH',
        logo: 'nweth.png',
        address: 'inj1kehk5nvreklhylx22p3x0yjydfsz9fv3fvg5xt',
        decimals: 18,
      },
    ],
  },

  BAND: {
    name: 'Band Protocol',
    logo: 'band.webp',
    coinGeckoId: 'band-protocol',

    erc20: {
      symbol: 'BAND',
      decimals: 18,
      address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
    },
  },

  BSKT: {
    name: 'Basket',
    logo: 'bskt.png',
    coinGeckoId: 'basket',

    erc20: {
      decimals: 5,
      symbol: 'BSKT',
      address: '0xbC0899E527007f1B8Ced694508FCb7a2b9a46F53',
    },

    spl: {
      decimals: 5,
      symbol: 'BSKT',
      isNative: false,
      address: '6gnCPhXtLnUD76HjQuSYPENLSZdG8RvDB1pTLM5aLSJA',
    },

    cw20s: [
      {
        symbol: 'BSKT',
        decimals: 5,
        source: TokenSource.Solana,
        address: 'inj193340xxv49hkug7r65xzc0l40tze44pee4fj94',
      },
    ],
  },

  BLACK: {
    name: 'BLACK',
    logo: 'BLACK.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj16eckaf75gcu9uxdglyvmh63k9t0l7chd0qmu85',
        symbol: 'BLACK',
        decimals: 6,
      },
    ],
  },

  ROOT: {
    name: 'The Root Network',
    logo: 'root.png',
    coinGeckoId: 'the-root-network',

    erc20: {
      symbol: 'ROOT',
      decimals: 6,
      address: '0xa3d4BEe77B05d4a0C943877558Ce21A763C4fa29',
    },
  },

  NONJA: {
    name: 'NONJA',
    logo: 'nonja.png',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'NONJA',
        decimals: 18,
        address: 'inj1fu5u29slsg2xtsj7v5la22vl4mr4ywl7wlqeck',
      },
    ],
  },

  NBOY: {
    name: 'NinjaBoy',
    logo: 'NBlogo.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1nmc5namhwszx0yartvjm6evsxrj0ctq2qa30l7',
        symbol: 'NBOY',
        decimals: 6,
      },
    ],
  },

  MONKS: {
    name: 'MONKS',
    logo: 'monksimg.png',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'MONKS',
        decimals: 18,
        address: 'inj148sjw9h9n3n8gjw37reetwdlc7v4hfhl8r7vv3',
      },
    ],
  },

  RAY: {
    name: 'Raymond',
    logo: 'ray.png',
    symbol: 'RAY',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'RAY',
        decimals: 6,
        address: 'inj1ckddr5lfwjvm2lvtzra0ftx7066seqr3navva0',
      },
    ],
  },

  SUSDE: {
    name: 'Staked USDe',
    logo: 'staked-usde.webp',
    coinGeckoId: 'ethena-staked-usde',

    erc20: {
      symbol: 'sUSDE',
      decimals: 18,
      address: '0x9D39A5DE30e57443BfF2A8307A4256c8797A3497',
    },
  },

  NLC: {
    name: 'Ninja Labs Coin',
    logo: 'nlc.png',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'NLC',
        decimals: 6,
        address: 'inj1r9h59ke0a77zkaarr4tuq25r3lt9za4r2mgyf4',
      },
    ],
  },

  ENA: {
    name: 'Ethena',
    logo: 'ethena.webp',
    coinGeckoId: 'ethena',

    erc20: {
      symbol: 'ENA',
      decimals: 18,
      address: '0x57e114b691db790c35207b2e685d4a43181e6061',
    },
  },

  BONJO: {
    name: 'Bonjo',
    logo: 'bonjo.png',
    coinGeckoId: '',

    cw20s: [
      {
        symbol: 'BONJO',
        decimals: 18,
        address: 'inj19w5lfwk6k9q2d8kxnwsu4962ljnay85f9sgwn6',
      },
    ],

    tokenFactories: [
      {
        creator: 'inj1r35twz3smeeycsn4ugnd3w0l5h2lxe44ptuu4w',
        symbol: 'BONJO',
        decimals: 6,
      },
    ],
  },

  BONUS: {
    name: 'Bonus Block',
    coinGeckoId: '',
    logo: 'bonus-block.png',

    ibcs: [
      {
        symbol: 'BONUS',
        decimals: 8,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/5mejeW9oeeWU7B84t6CSjXskTumVWsapjsbpsivtVZQw',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: 'DCF43489B9438BB7E462F1A1AD38C7898DF7F49649F9CC8FEBFC533A1192F3EF',
        source: TokenSource.Arbitrum,
      },
    ],
  },

  W: {
    name: 'Wormhole',
    coinGeckoId: 'wormhole',
    logo: 'wormhole.png',

    ibcs: [
      {
        symbol: 'W',
        decimals: 6,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/2Wb6ueMFc9WLc2eyYVha6qnwHKbwzUXdooXsg6XXVvos',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: 'F16F0F685BEF7BC6A145F16CBE78C6EC8C7C3A5F3066A98A9E57DCEA0903E537',
        source: TokenSource.Solana,
      },
    ],
  },

  SAE: {
    name: 'Summoners Arena Essence',
    logo: 'sae.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj152mdu38fkkk4fl7ycrpdqxpm63w3ztadgtktyr',
        symbol: 'SAE',
        decimals: 6,
      },
    ],

    evm: {
      symbol: 'SAE',
      decimals: 18,
      address: '0x2FD85ED6EF7c26E07619cF32aee535f3D4393a0F',
    },

    ibcs: [
      {
        symbol: 'SAE',
        decimals: 8,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/2mWv5umZHxJ1X8zMeSw3hFPdGuUZmq5UjbCsmJcDdEW1',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '0AFCFFE18230E0E703A527F7522223D808EBB0E02FDBC84AAF8A045CD8FE0BBB',
        source: TokenSource.BinanceSmartChain,
      },
    ],
  },

  XIII: {
    name: 'XIII Coin',
    logo: 'xiii.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj18flmwwaxxqj8m8l5zl8xhjrnah98fcjp3gcy3e',
        symbol: 'XIII',
        decimals: 6,
      },
    ],
  },

  DDL: {
    name: 'Discordels Token',
    logo: 'ddl.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1put8lfpkwm47tqcl9fgh8grz987mezvrx4arls',
        symbol: 'DDL',
        decimals: 6,
      },
    ],
  },

  ASG: {
    name: 'Ancient Summoners Gem',
    logo: 'asg.png',
    coinGeckoId: '',

    evm: {
      symbol: 'ASG',
      decimals: 18,
      address: '0x2ef776488739722Ad174F8f2ffE76eb67a8467Eb',
    },

    ibcs: [
      {
        symbol: 'ASG',
        decimals: 8,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/54RgtKyJuM9boEu4G7Dzp2mMrg6w5MuctfU95HoHHeL3',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '2D40732D27E22D27A2AB79F077F487F27B6F13DB6293040097A71A52FB8AD021',
        source: TokenSource.BinanceSmartChain,
      },
    ],
  },

  CLON: {
    name: 'CLON',
    logo: 'clon1.png',

    ibcs: [
      {
        symbol: 'CLON',
        decimals: 6,
        isNative: true,
        baseDenom:
          'cw20:terra164ssz60yvsxey0ku9mtcaegdeyxwzuwwqyrp238nvflwqve0pvxsra7fa2',
        path: 'transfer/channel-116',
        channelId: 'channel-116',
        hash: '695B1D16DE4D0FD293E6B79451640974080B59AA60942974C1CC906568DED795',
        source: TokenSource.Cosmos,
      },
    ],
  },

  SPUUN: {
    name: 'SPUUN',
    logo: 'spuun.png',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj1flkktfvf8nxvk300f2z3vxglpllpw59c563pk7',
        symbol: 'SPUUN',
        decimals: 6,
      },
    ],
  },

  OMNI: {
    name: 'Omni Network',
    logo: 'omni.png',
    symbol: 'OMNI',
    coinGeckoId: 'omni-network',

    erc20: {
      symbol: 'OMNI',
      decimals: 18,
      address: '0x36e66fbbce51e4cd5bd3c62b637eb411b18949d4',
    },
  },

  SAGA: {
    name: 'Saga',
    logo: 'saga.webp',

    ibcs: [
      {
        symbol: 'SAGA',
        decimals: 6,
        isNative: true,
        baseDenom: 'usaga',
        path: 'transfer/channel-261',
        channelId: 'channel-261',
        hash: 'AF921F0874131B56897A11AA3F33D5B29CD9C147A1D7C37FE8D918CB420956B2',
        source: TokenSource.Cosmos,
      },
    ],
  },

  ezETH: {
    name: 'Renzo Restaked ETH',
    logo: 'ezeth.webp',
    symbol: 'ezETH',
    coinGeckoId: 'renzo-restaked-eth',

    erc20: {
      symbol: 'ezETH',
      decimals: 18,
      address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    },
  },

  GOLDIE: {
    name: 'Goldicocks',
    logo: 'goldie.webp',
    symbol: 'GOLDIE',
    coinGeckoId: '',

    tokenFactories: [
      {
        creator: 'inj130ayayz6ls8qpmu699axhlg7ygy8u6thjjk9nc',
        symbol: 'GOLDIE',
        decimals: 6,
      },
    ],
  },
  XAG: {
    name: 'Silver',
    symbol: 'XAG',
    decimals: 6,
    logo: 'xag.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  CAD: {
    name: 'Canadian Dollar',
    symbol: 'CAD',
    decimals: 6,
    logo: 'cad.svg',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },
  NBZ: {
    name: 'Ninja Blaze Token',
    coinGeckoId: '',
    logo: 'nbz.png',

    ibcs: [
      {
        symbol: 'NBZ',
        decimals: 6,
        isNative: true,
        baseDenom:
          'factory/neutron1a6ydq8urdj0gkvjw9e9e5y9r5ce2qegm9m4xufpt96kcm60kmuass0mqq4/nbz',
        path: 'transfer/channel-177',
        channelId: 'channel-177',
        hash: '1011E4D6D4800DA9B8F21D7C207C0B0C18E54E614A8576037F066B775210709D',
        source: TokenSource.Cosmos,
      },
    ],
  },

  MOTHER: {
    name: 'MOTHER IGGY',
    coinGeckoId: 'mother-iggy',
    logo: 'mother.webp',

    ibcs: [
      {
        symbol: 'MOTHER',
        decimals: 6,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/3yX6ZZbagFp8pLni1gsy9zifaCMYyARGqADqCBwgABgA',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: '984E90A8E0265B9804B7345C7542BF9B3046978AE5557B4AABADDFE605CACABE',
        source: TokenSource.Solana,
      },
    ],
  },

  BODEN: {
    name: 'jeo boden',
    logo: 'boden.png',
    decimals: 9,
    symbol: 'BODEN',
    coinGeckoId: 'jeo-boden',
    tokenType: TokenType.Unknown,
  },

  GME: {
    name: 'Gamestop',
    coinGeckoId: 'gme',
    logo: 'gme.jpeg',

    ibcs: [
      {
        symbol: 'GME',
        decimals: 8,
        isNative: false,
        baseDenom:
          'factory/wormhole14ejqjyq8um4p3xfqj74yld5waqljf88fz25yxnma0cngspxe3les00fpjx/3nNG5xw6fTXkcQCr36ySsd2jpQR5HgVvrQJtsSaAtiQq',
        path: 'transfer/channel-183',
        channelId: 'channel-183',
        hash: 'CAA5AB050F6C3DFE878212A37A4A6D3BEA6670F5B9786FFF7EF2D34213025272',
        source: TokenSource.Solana,
      },
    ],
  },
} as Record<string, TokenMetaBase>
