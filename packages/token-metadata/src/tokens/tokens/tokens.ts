import { TokenMeta, TokenSource, TokenType } from '../../types'

export default {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    logo: 'bitcoin.png',
    coinGeckoId: 'bitcoin',
    tokenType: TokenType.Erc20,

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
    logo: 'wbtc.png',
    coinGeckoId: 'wrapped-bitcoin',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        decimals: 18,
        symbol: 'wBTC',
        source: TokenSource.Cosmos,
        address: 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logo: 'ethereum.png',
    coinGeckoId: 'ethereum',
    tokenType: TokenType.Erc20,

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
    logo: 'ethereum.png',
    coinGeckoId: 'ethereum',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        symbol: 'wETH',
        decimals: 8,
        address: 'inj1plsk58sxqjw9828aqzeskmc8xy9eu5kppw3jg4',
        tokenType: TokenType.Cw20,
        source: TokenSource.Arbitrum,
      },
      {
        symbol: 'wETH',
        decimals: 8,
        address: 'inj1k9r62py07wydch6sj5sfvun93e4qe0lg7jyatc',
        tokenType: TokenType.Cw20,
        source: TokenSource.EthereumWh,
      },
    ],
  },

  INJ: {
    name: 'Injective',
    symbol: 'INJ',
    decimals: 18,
    logo: 'injective-v3.png',
    coinGeckoId: 'injective-protocol',
    tokenType: TokenType.Native,

    erc20: {
      decimals: 18,
      address: '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
      tokenType: TokenType.Erc20,
    },

    cw20s: [
      {
        decimals: 8,
        symbol: 'INJbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1xcgprh58szttp0vqtztvcfy34tkpupr563ua40',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 8,
        symbol: 'INJet',
        source: TokenSource.EthereumWh,
        address: 'inj1v8gg4wzfauwf9l7895t0eyrrkwe65vh5n7dqmw',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
    logo: 'usdt.png',
    coinGeckoId: 'tether',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      tokenType: TokenType.Erc20,
    },

    ibc: {
      decimals: 6,
      symbol: 'USDTkv',
      isNative: true,
      baseDenom: 'erc20/tether/usdt',
      path: 'transfer/channel-143',
      channelId: 'channel-143',
      hash: '4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
      tokenType: TokenType.Ibc,
    },

    cw20s: [
      {
        decimals: 6,
        symbol: 'USDTbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1l9eyrnv3ret8da3qh8j5aytp6q4f73crd505lj',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDTso',
        source: TokenSource.Solana,
        address: 'inj18zykysxw9pcvtyr9ylhe0p5s7yzf6pzdagune8',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDTso',
        source: TokenSource.Solana,
        address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDTap',
        source: TokenSource.Aptos,
        address: 'inj13yrhllhe40sd3nj0lde9azlwfkyrf2t9r78dx5',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDTso',
        source: TokenSource.Solana,
        address: 'inj1qjn06jt7zjhdqxgud07nylkpgnaurq6xc5c4fd',
        tokenType: TokenType.Cw20,
      },
    ],
  },

  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: 'usdc.png',
    coinGeckoId: 'usd-coin',
    tokenType: TokenType.Erc20,

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
        source: TokenSource.EthereumWh,
        address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDCso',
        source: TokenSource.Solana,
        address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDCarb',
        source: TokenSource.Arbitrum,
        address: 'inj1lmcfftadjkt4gt3lcvmz6qn4dhx59dv2m7yv8r',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDCbsc',
        source: TokenSource.BinanceSmartChain,
        address: 'inj1dngqzz6wphf07fkdam7dn55t8t3r6qenewy9zu',
        tokenType: TokenType.Cw20,
      },
      {
        decimals: 6,
        symbol: 'USDCpoly',
        source: TokenSource.Polygon,
        address: 'inj19s2r64ghfqq3py7f5dr0ynk8yj0nmngca3yvy3',
        tokenType: TokenType.Cw20,
      },
    ],

    ibc: {
      decimals: 6,
      symbol: 'USDCnb',
      baseDenom: 'uusdc',
      isNative: true,
      channelId: 'channel-148',
      path: 'transfer/channel-148',
      hash: '2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
      tokenType: TokenType.Ibc,
    },

    spl: {
      decimals: 6,
      symbol: 'USDCso',
      isNative: false,
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenType: TokenType.Spl,
    },
  },

  GRT: {
    name: 'Graph Token',
    symbol: 'GRT',
    decimals: 18,
    logo: 'graphToken.png',
    coinGeckoId: 'the-graph',
    tokenType: TokenType.Erc20,

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
    logo: 'synthetix.png',
    coinGeckoId: 'havven',
    tokenType: TokenType.Erc20,

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
    logo: 'bnb.png',
    coinGeckoId: 'binancecoin',
    tokenType: TokenType.Erc20,

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
    logo: 'AAVE.png',
    coinGeckoId: 'aave',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      tokenType: TokenType.Erc20,
    },
  },

  YFI: {
    name: 'yearn.finance',
    symbol: 'YFI',
    logo: 'yfi.png',
    decimals: 18,
    coinGeckoId: 'yearn-finance',
    tokenType: TokenType.Erc20,

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
    logo: 'comp.png',
    coinGeckoId: 'compound-coin',
    tokenType: TokenType.Erc20,

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
    logo: 'zrx.png',
    coinGeckoId: '0x',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      tokenType: TokenType.Erc20,
    },
  },

  UNI: {
    name: 'Uniswap',
    symbol: 'UNI',
    logo: 'uni.png',
    decimals: 18,
    coinGeckoId: 'uniswap',
    tokenType: TokenType.Erc20,

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
    logo: 'dai.png',
    coinGeckoId: 'dai',
    tokenType: TokenType.Erc20,

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
    logo: 'chainlink.png',
    coinGeckoId: 'chainlink',
    tokenType: TokenType.Erc20,

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
    logo: 'sushi.png',
    coinGeckoId: 'sushi',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    logo: 'atom.png',
    coinGeckoId: 'cosmos',
    tokenType: TokenType.Ibc,

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
    logo: 'atom.png',
    coinGeckoId: 'cosmos',
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Ibc,

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
    logo: 'injective-v3.png',
    symbol: 'TAB',
    decimals: 18,
    coinGeckoId: 'injective-protocol',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Ibc,

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
    logo: 'whale.png',
    coinGeckoId: 'white-whale',
    tokenType: TokenType.Ibc,

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

  NOIS: {
    name: 'Nois',
    symbol: 'NOIS',
    decimals: 6,
    coinGeckoId: 'nois',
    logo: 'nois.png',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'unois',
      path: 'transfer/channel-138',
      channelId: 'channel-138',
      hash: 'DD9182E8E2B13C89D6B4707C7B43E8DB6193F9FF486AFA0E6CF86B427B0D231A',
      tokenType: TokenType.Ibc,
    },
  },

  AXL: {
    name: 'Axelar',
    logo: 'axelar.png',
    symbol: 'AXL',
    decimals: 6,
    coinGeckoId: 'axelar',
    tokenType: TokenType.Ibc,

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
    logo: 'bayc.png',
    decimals: 18,
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  APE: {
    name: 'Ape Coin',
    symbol: 'APE',
    decimals: 18,
    logo: 'ape.png',
    coinGeckoId: 'apecoin',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Ibc,

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
    logo: 'xprt.png',
    coinGeckoId: 'persistence',
    tokenType: TokenType.Ibc,

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
    logo: 'evmos.png',
    coinGeckoId: 'evmos',
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Unknown,
  },

  DOT: {
    name: 'Polkadot',
    symbol: 'DOT',
    decimals: 10,
    logo: 'dot.jpeg',
    coinGeckoId: 'polkadot',
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Ibc,

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
    tokenType: TokenType.Ibc,

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

  ZEN: {
    name: 'ZEN',
    logo: 'zen.svg',
    symbol: 'ZEN',
    decimals: 18,
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,

    cw20: {
      decimals: 18,
      address: 'uzen',
      tokenType: TokenType.Cw20,
    },
  },

  PROJ: {
    name: 'PROJ',
    logo: 'proj.png',
    symbol: 'PROJ',
    decimals: 18,
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,

    cw20: {
      decimals: 18,
      address: 'proj',
      tokenType: TokenType.Cw20,
    },
  },

  PUNK: {
    name: 'Punk DAO Token',
    logo: 'PUNK.png',
    symbol: 'PUNK',
    decimals: 6,
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  PROJX: {
    name: 'PROJX',
    logo: 'projx.png',
    symbol: 'PROJX',
    decimals: 18,
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,

    cw20: {
      decimals: 18,
      address: 'projx',
      tokenType: TokenType.Cw20,
    },
  },

  ASTRO: {
    name: 'ASTRO',
    symbol: 'ASTRO',
    decimals: 6,
    logo: 'astroport.png',
    coinGeckoId: 'astroport-fi',
    tokenType: TokenType.Ibc,

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
    logo: 'solana.png',
    coinGeckoId: 'solana',
    tokenType: TokenType.Cw20,

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
    tokenType: TokenType.Ibc,

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
    logo: 'ethbtctrend.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

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
    logo: 'steadyeth.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

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
    logo: 'steadybtc.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

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
    logo: 'xpla.png',
    coinGeckoId: 'xpla',
    tokenType: TokenType.Cw20,

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
    tokenType: TokenType.Cw20,

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
    type: TokenType.TokenFactory,
  },

  CHZ: {
    name: 'Chiliz',
    symbol: 'CHZ',
    decimals: 18,
    logo: 'chz.png',
    coinGeckoId: 'chiliz',
    tokenType: TokenType.Cw20,

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
    tokenType: TokenType.Ibc,

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
    logo: 'injective-v3.png',
    coinGeckoId: 'injective-protocol',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Cw20,

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

  ARB: {
    name: 'Arbitrum',
    symbol: 'ARB',
    decimals: 18,
    logo: 'arb-circle.png',
    coinGeckoId: 'arbitrum',
    tokenType: TokenType.Cw20,

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
      source: TokenSource.Arbitrum,
      tokenType: TokenType.Cw20,
    },
  },

  EUR: {
    name: 'Euro',
    symbol: 'EUR',
    decimals: 6,
    logo: 'eur.png',
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
    logo: 'jpy.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  BRZ: {
    name: 'Brazilian Digital Token',
    symbol: 'BRZ',
    decimals: 4,
    logo: 'brz.png',
    coinGeckoId: 'brz',
    tokenType: TokenType.Cw20,

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
    logo: 'astar.png',
    coinGeckoId: 'astar',
    tokenType: TokenType.Cw20,

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
    logo: 'gold.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
  },

  ALPHA: {
    name: 'Alpha Coin',
    symbol: 'ALPHA',
    decimals: 18,
    logo: 'alpha.png',
    coinGeckoId: 'alphacoin',
    tokenType: TokenType.Cw20,

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
    tokenType: TokenType.Cw20,

    evm: {
      decimals: 18,
      isNative: true,
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      tokenType: TokenType.Evm,
    },

    cw20: {
      decimals: 8,
      address: 'inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
      source: TokenSource.Polygon,
      tokenType: TokenType.Cw20,
    },
  },

  '1MPEPE': {
    name: 'Pepe',
    symbol: 'MPEPE',
    decimals: 18,
    logo: 'pepe.jpeg',
    coinGeckoId: 'pepe',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Ibc,

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
    logo: 'xrp.png',
    coinGeckoId: 'ripple',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
      tokenType: TokenType.Erc20,
    },
  },

  DEMO: {
    name: 'Demo Coin',
    symbol: 'DEMO',
    decimals: 6,
    logo: 'injective-v3.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  RAI: {
    name: 'Rai Reflex Index',
    symbol: 'RAI',
    decimals: 18,
    logo: 'rai.png',
    coinGeckoId: 'rai',
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    tokenType: TokenType.Erc20,

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
    logo: 'omi.png',
    coinGeckoId: 'ecomi',
    tokenType: TokenType.Erc20,

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
    logo: 'point.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  KAVA: {
    name: 'KAVA',
    symbol: 'KAVA',
    decimals: 6,
    logo: 'kava.webp',
    coinGeckoId: 'kava',
    tokenType: TokenType.Ibc,

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
    symbol: 'VATRENI',
    decimals: 18,
    logo: 'vatreni.jpeg',
    coinGeckoId: 'croatian-ff-fan-token',
    tokenType: TokenType.Cw20,

    evm: {
      decimals: 18,
      isNative: true,
      address: '0xD60DebA014459F07BBcC077a5B817f31DaFD5229',
      tokenType: TokenType.Evm,
    },

    cw20: {
      decimals: 8,
      address: 'inj1tn457ed2gg5vj2cur5khjjw63w73y3xhyhtaay',
      source: TokenSource.Polygon,
      tokenType: TokenType.Cw20,
    },
  },

  NBLA: {
    name: 'Nebula',
    symbol: 'NBLA',
    decimals: 6,
    logo: 'nebula.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  WKLAY: {
    name: 'Wrapped Klaytn',
    symbol: 'WKLAY',
    decimals: 8,
    logo: 'klaytn.webp',
    coinGeckoId: 'klay-token',
    tokenType: TokenType.Cw20,

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
    logo: 'neok.png',
    coinGeckoId: '',
    tokenType: TokenType.Ibc,

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
    logo: 'orai.png',
    coinGeckoId: 'oraichain-token',
    tokenType: TokenType.Ibc,

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
    logo: 'gold.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
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
    symbol: 'TIA',
    decimals: 6,
    logo: 'tia.webp',
    coinGeckoId: 'celestia',
    tokenType: TokenType.Ibc,

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'utia',
      path: 'transfer/channel-152',
      channelId: 'channel-152',
      hash: 'F51BB221BAA275F2EBF654F70B005627D7E713AFFD6D86AFD1E43CAA886149F4',
      tokenType: TokenType.Ibc,
    },
  },

  TALIS: {
    name: 'Talis',
    symbol: 'TALIS',
    decimals: 6,
    logo: 'talis.webp',
    coinGeckoId: 'talis-protocol',
    tokenType: TokenType.TokenFactory,
  },

  KIRA: {
    name: 'KIRA',
    symbol: 'KIRA',
    decimals: 6,
    logo: 'kira.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  USDY: {
    name: 'Ondo US Dollar Yield',
    symbol: 'USDY',
    decimals: 18,
    logo: 'usdy.webp',
    coinGeckoId: 'ondo-us-dollar-yield',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x96F6eF951840721AdBF46Ac996b59E0235CB985C',
      tokenType: TokenType.Erc20,
    },
  },

  KUJI: {
    name: 'Kujira',
    symbol: 'KUJI',
    decimals: 6,
    logo: 'kuji.webp',
    coinGeckoId: 'kujira',
    tokenType: TokenType.Ibc,

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ukuji',
      path: 'transfer/channel-98',
      channelId: 'channel-98',
      hash: '9A115B56E769B92621FFF90567E2D60EFD146E86E867491DB69EEDA9ADC36204',
      tokenType: TokenType.Ibc,
    },
  },

  'USDC-MPL': {
    name: 'USDC Maple',
    symbol: 'USDC-MPL',
    decimals: 6,
    logo: 'usdc-mpl.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 6,
      address: '0xf875aef00C4E21E9Ab4A335eB36A1175Ab00424A',
      tokenType: TokenType.Erc20,
    },
  },

  PYTH: {
    name: 'Pyth Network',
    symbol: 'PYTH',
    decimals: 6,
    logo: 'pyth.png',
    coinGeckoId: 'pyth-network',
    tokenType: TokenType.Cw20,

    spl: {
      decimals: 6,
      symbol: 'PYTH',
      isNative: false,
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
      tokenType: TokenType.Spl,
    },

    cw20: {
      decimals: 6,
      symbol: 'PYTH',
      source: TokenSource.Solana,
      address: 'inj1tjcf9497fwmrnk22jfu5hsdq82qshga54ajvzy',
      tokenType: TokenType.Cw20,
    },
  },

  TIX: {
    name: 'Timeworx.io',
    symbol: 'TIX',
    decimals: 6,
    logo: 'tix.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  NINJ: {
    name: 'Gryphon Staked Injective',
    symbol: 'nINJ',
    decimals: 18,
    logo: 'ninj.png',
    coinGeckoId: '',
    tokenType: TokenType.Cw20,

    cw20: {
      decimals: 18,
      symbol: 'nINJ',
      address: 'inj13xlpypcwl5fuc84uhqzzqumnrcfpptyl6w3vrf',
      tokenType: TokenType.Cw20,
    },
  },

  BINJ: {
    name: 'Bird INJ',
    symbol: 'BINJ',
    decimals: 6,
    logo: 'bird.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  NINJA: {
    name: 'Dog Wif Nunchucks',
    symbol: 'NINJA',
    decimals: 6,
    logo: 'ninja.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  KATANA: {
    name: 'Dog Wif Katana',
    symbol: 'KATANA',
    decimals: 6,
    logo: 'katana.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  GALAXY: {
    name: 'GALAXY',
    symbol: 'GALAXY',
    decimals: 6,
    logo: 'galaxy.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  AOI: {
    name: 'Alien Token',
    symbol: '$AOI',
    decimals: 6,
    logo: 'aoi.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  NOBI: {
    name: 'Shinobi',
    symbol: 'NOBI',
    decimals: 6,
    logo: 'nobi.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  YUKI: {
    name: 'Yuki Dog',
    symbol: 'YUKI',
    decimals: 6,
    logo: 'yuki.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  WAGMI: {
    name: 'Wagmi Coin',
    symbol: 'WAGMI',
    decimals: 9,
    logo: 'wagmi.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  BAMBOO: {
    name: 'Injective Panda',
    symbol: 'BAMBOO',
    decimals: 6,
    logo: 'panda.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  SHURIKEN: {
    name: 'Shuriken Token',
    symbol: 'SHURIKEN',
    decimals: 6,
    logo: 'shuriken.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  BRETT: {
    name: 'BluePepe',
    symbol: 'BRETT',
    decimals: 6,
    logo: 'brett.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  ZIG: {
    name: 'ZigCoin',
    symbol: 'ZIG',
    decimals: 18,
    logo: 'zigg.jpeg',
    coinGeckoId: 'zignaly',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0xb2617246d0c6c0087f18703d576831899ca94f01',
      tokenType: TokenType.Erc20,
    },
  },

  DOJ: {
    name: 'DOJcoin',
    symbol: 'DOJ',
    decimals: 6,
    logo: 'doj.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  SKIPBIDIDOBDOBDOBYESYESYESYES: {
    name: 'SKIPBIDIDOBDOBDOBYESYESYESYES',
    symbol: 'SKIPBIDIDOBDOBDOBYESYESYESYES',
    decimals: 9,
    logo: 'skibidi.jpeg',
    coinGeckoId: '',

    erc20: {
      decimals: 9,
      address: '0x5085202d0A4D8E4724Aa98C42856441c3b97Bc6d',
      tokenType: TokenType.Erc20,
    },
  },

  GINGER: {
    name: 'GINGER',
    symbol: 'GINGER',
    decimals: 6,
    logo: 'ginger.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  ERIC: {
    name: 'TheJanitor',
    symbol: 'ERIC',
    decimals: 6,
    logo: 'eric.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  INJINU: {
    name: 'INJINU',
    symbol: 'INJINU',
    decimals: 6,
    logo: 'injinu.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  Babykira: {
    name: 'Babykira',
    symbol: '$Babykira',
    decimals: 6,
    logo: 'babykira.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  LIOR: {
    name: 'LIOR',
    symbol: 'LIOR',
    decimals: 6,
    logo: 'lior.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  INJINEER: {
    name: 'INJINEER',
    symbol: 'INJER',
    decimals: 6,
    logo: 'INJINEER.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  SHIBA: {
    name: 'Shiba',
    symbol: 'shibainj',
    decimals: 6,
    logo: 'shiba.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  GROK: {
    name: 'GROK',
    symbol: 'GROK',
    decimals: 6,
    logo: 'grok.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  SNOWY: {
    name: 'Injective Snowy',
    symbol: 'SNOWY',
    decimals: 6,
    logo: 'snowy.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  BULLS: {
    name: 'BULLS',
    symbol: 'BULLS',
    decimals: 6,
    logo: 'bulls.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  LVN: {
    name: 'Levana',
    symbol: 'LVN',
    decimals: 6,
    coinGeckoId: 'levana-protocol',
    logo: 'lvn.png',
    tokenType: TokenType.Ibc,

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'ulvn',
      path: 'transfer/channel-8',
      channelId: 'channel-8',
      hash: '4971C5E4786D5995EC7EF894FCFA9CF2E127E95D5D53A982F6A062F3F410EDB8',
      tokenType: TokenType.Ibc,
    },
  },

  KINJA: {
    name: 'Kinja',
    symbol: 'KINJA',
    decimals: 6,
    logo: 'kinja.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  LAMA: {
    name: 'LAMA',
    symbol: 'LAMA',
    decimals: 6,
    logo: 'lama.webp',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  INJEX: {
    name: 'Internet Explorer',
    symbol: 'INJEX',
    decimals: 6,
    logo: 'injex.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  NINJB: {
    name: 'NINJB',
    symbol: 'NINJB',
    decimals: 6,
    logo: 'ninjb.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  KARATE: {
    name: 'Doge Wif Karate',
    symbol: 'KARATE',
    decimals: 6,
    logo: 'karate.jpg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  NPEPE: {
    name: 'NinjaPepe',
    symbol: 'NPEPE',
    decimals: 6,
    logo: 'NPEPE.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  MILK: {
    name: 'MILK',
    symbol: 'MILK',
    decimals: 6,
    logo: 'milk.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  INCEL: {
    name: 'InjectiveCelestiaNoFapLadyBoy420Inu',
    symbol: 'INCEL',
    decimals: 6,
    logo: 'incel.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  PIKACHU: {
    name: 'Pikachu',
    symbol: 'PIKA',
    decimals: 6,
    logo: 'pikachu.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  WGMI: {
    name: 'WGMI',
    symbol: 'WGMI',
    decimals: 6,
    logo: 'wgmi.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  WIZZ: {
    name: 'WIZZ',
    symbol: 'WIZZ',
    decimals: 6,
    logo: 'wizz.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  MEMEME: {
    name: 'Mememe',
    symbol: 'MEMEME',
    decimals: 18,
    logo: 'meme.png',
    coinGeckoId: 'mememe',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x1A963Df363D01EEBB2816b366d61C917F20e1EbE',
      tokenType: TokenType.Erc20,
    },
  },

  MAGA: {
    name: 'Trump',
    symbol: 'MAGA',
    decimals: 9,
    logo: 'maga.png',
    coinGeckoId: 'maga',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 9,
      address: '0x576e2BeD8F7b46D34016198911Cdf9886f78bea7',
      tokenType: TokenType.Erc20,
    },
  },

  SDEX: {
    name: 'SmarDex',
    symbol: 'SDEX',
    decimals: 18,
    logo: 'maga.png',
    coinGeckoId: 'smardex',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x5DE8ab7E27f6E7A1fFf3E5B337584Aa43961BEeF',
      tokenType: TokenType.Erc20,
    },
  },

  OX: {
    name: 'Open Exchange Token',
    symbol: 'OX',
    decimals: 18,
    logo: 'ox.png',
    coinGeckoId: 'open-exchange-token',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x78a0A62Fba6Fb21A83FE8a3433d44C73a4017A6f',
      tokenType: TokenType.Erc20,
    },
  },

  FUSDT: {
    name: 'Flux USDT',
    symbol: 'fUSDT',
    decimals: 8,
    logo: 'flux.png',
    coinGeckoId: 'flux-usdt',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 8,
      address: '0x81994b9607e06ab3d5cF3AffF9a67374f05F27d7',
      tokenType: TokenType.Erc20,
    },
  },

  PVP: {
    name: 'PVP',
    symbol: 'PVP',
    decimals: 8,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 8,
      address: '0x9B44793a0177C84DD01AD81137db696531902871',
      tokenType: TokenType.Erc20,
    },
  },

  POOR: {
    name: 'Proof Of Officially Rugged',
    symbol: 'POOR',
    decimals: 8,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 8,
      address: '0x9D433Fa992C5933D6843f8669019Da6D512fd5e9',
      tokenType: TokenType.Erc20,
    },
  },

  VRD: {
    name: 'Viridis Network',
    symbol: 'VRD',
    decimals: 18,
    logo: 'vrd.png',
    coinGeckoId: 'viridis-network',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0xf25304e75026E6a35FEDcA3B0889aE5c4D3C55D8',
      tokenType: TokenType.Erc20,
    },
  },

  NONE: {
    name: 'None Trading',
    symbol: 'NONE',
    decimals: 18,
    logo: 'none.webp',
    coinGeckoId: 'none-trading',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0x903ff0ba636E32De1767A4B5eEb55c155763D8B7',
      tokenType: TokenType.Erc20,
    },
  },

  DUDE: {
    name: 'DUDE',
    symbol: 'DUDE',
    decimals: 6,
    logo: 'dude.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  AUTISM: {
    name: 'AUTISM',
    symbol: 'AUTISM',
    decimals: 6,
    logo: 'autism.png',
    coinGeckoId: 'autism',
    tokenType: TokenType.TokenFactory,
  },

  NOBITCHES: {
    name: 'Extra Virgin Olive Inu',
    symbol: 'NOBITCHES',
    decimals: 6,
    logo: 'extravirginoliveinu.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  MILA: {
    name: 'MILA',
    symbol: 'MILA',
    decimals: 6,
    logo: 'mila.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  DOJO: {
    name: 'Dojo Bot',
    symbol: 'DOJO',
    decimals: 6,
    logo: 'dojo.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  IPANDAAI: {
    name: 'Injective Panda AI',
    symbol: 'IPandaAI',
    decimals: 6,
    logo: 'ipdai.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  COCK: {
    name: 'ROOSTER NINJA',
    symbol: 'COCK',
    decimals: 6,
    logo: 'cock.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  MOONIFY: {
    name: 'Moonify',
    symbol: 'MOONIFY',
    decimals: 6,
    logo: 'moonify.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  KARMA: {
    name: 'Karma',
    symbol: 'KARMA',
    decimals: 6,
    logo: 'karma.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  DREAM: {
    name: 'DREAM',
    symbol: 'DREAM',
    decimals: 6,
    logo: 'DREAM.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  DGNZ: {
    name: 'Injective Degens',
    symbol: 'DGNZ',
    decimals: 6,
    logo: 'DGNZ.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  INJECT: {
    name: 'Injectools',
    symbol: 'INJECT',
    decimals: 6,
    logo: 'INJECT.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  WAIFU: {
    name: 'Waifu',
    symbol: 'WAIFU',
    decimals: 6,
    logo: 'waifu-logo.png',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  },

  APP: {
    name: 'Moon App',
    symbol: 'APP',
    decimals: 18,
    logo: 'app.jpeg',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

    erc20: {
      decimals: 18,
      address: '0xC5d27F27F08D1FD1E3EbBAa50b3442e6c0D50439',
      tokenType: TokenType.Erc20,
    },
  },

  ELON: {
    name: 'ELON',
    symbol: 'ELON',
    decimals: 6,
    logo: 'https://i.ibb.co/bgtD1rS/Elon.png',
    coinGeckoId: '',
  
    erc20: {
      decimals: 6,
      address: '0x43123e1d077351267113ada8bE85A058f5D492De',
      tokenType: TokenType.Erc20,
    },
  
    cw20: {
      decimals: 6,
      address: 'inj10pqutl0av9ltrw9jq8d3wjwjayvz76jhfcfza0',
      tokenType: TokenType.Cw20,
    },
  }
} as Record<string, TokenMeta>
