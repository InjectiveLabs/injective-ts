import tokens from './tokens'
import {
  TokenMeta,
  TokenType,
  TokenSource,
  Cw20TokenMetaWithSource,
} from '../../types'

export const overrideCw20s = (
  source: Cw20TokenMetaWithSource,
  cw20sList?: Cw20TokenMetaWithSource[],
) => {
  if (!cw20sList) {
    return [source]
  }

  const overrideCw20ItemIndex = cw20sList.findIndex(
    ({ symbol }) => symbol === source.symbol,
  )

  if (overrideCw20ItemIndex === -1) {
    return [...cw20sList, source]
  }

  cw20sList[overrideCw20ItemIndex] = source

  return cw20sList
}

export const testnetTokens = () =>
  ({
    wBTC: {
      ...tokens.wBTC,
      cw20s: [
        ...(tokens.wBTC.cw20s || []),
        ...overrideCw20s(
          {
            decimals: 8,
            symbol: 'wBTC',
            source: TokenSource.Cosmos,
            address: 'wbtc',
          },
          tokens.wBTC.cw20s,
        ),
      ],
    },

    ATOM: {
      ...tokens.ATOM,
      cw20s: [
        ...(tokens.ATOM.cw20s || []),
        {
          decimals: 8,
          symbol: 'ATOM',
          source: TokenSource.Cosmos,
          address: 'atom',
          tokenType: TokenType.Cw20,
        },
      ],
    },

    INJ: {
      ...tokens.INJ,
      erc20: {
        ...tokens.INJ.erc20,
        address: '0xAD1794307245443B3Cb55d88e79EEE4d8a548C03',
      },
    },

    USDT: {
      ...tokens.USDT,
      erc20: {
        ...tokens.USDT.erc20,
        address: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
      },
    },

    APE: {
      ...tokens.APE,
      erc20: {
        ...tokens.APE.erc20,
        address: '0x44C21afAaF20c270EBbF5914Cfc3b5022173FEB7',
      },
    },

    wETH: {
      ...tokens.wETH,
      erc20: {
        ...tokens.wETH.erc20,
        address: '0xdB309Bb079EB419C18fe7D568c61cD2FdB65D9aF',
      },
      cw20s: [
        ...(tokens.wETH.cw20s || []),
        {
          decimals: 8,
          symbol: 'wETH',
          source: TokenSource.EthereumWh,
          address: 'weth',
          tokenType: TokenType.Cw20,
        },
      ],
    },

    ASTRO: {
      ...tokens.ASTRO,
      ibc: {
        ...tokens.ASTRO.ibc,
        hash: 'E8AC6B792CDE60AB208CA060CA010A3881F682A7307F624347AB71B6A0B0BF89',
        path: 'transfer/channel-13',
        channelId: 'channel-13',
        baseDenom: 'ASTRO',
      },
    },

    SOL: {
      ...tokens.SOL,
      cw20s: [
        {
          ...(tokens.SOL.cw20s ? tokens.SOL.cw20s[0] : {}),
          address: 'inj12ngevx045zpvacus9s6anr258gkwpmthnz80e9',
        },
      ],
    },

    USDC: {
      ...tokens.USDC,
      erc20: {
        ...tokens.USDC.erc20,
        address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      },
      cw20s: [
        ...overrideCw20s(
          {
            decimals: 6,
            symbol: 'USDCet',
            source: TokenSource.EthereumWh,
            address: 'inj12sqy9uzzl3h3vqxam7sz9f0yvmhampcgesh3qw',
          },
          tokens.USDC.cw20s,
        ),
        {
          decimals: 6,
          symbol: 'USDC',
          source: TokenSource.Cosmos,
          address: 'usdc',
          tokenType: TokenType.Cw20,
        },
      ],
    },

    MATIC: {
      ...tokens.MATIC,
      evm: {
        ...tokens.MATIC.evm,
        address: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
      },
    },

    MITOTEST1: {
      ...tokens.MITOTEST1,
      cw20s: [
        {
          decimals: 18,
          symbol: 'MT1',
          source: TokenSource.EthereumWh,
          address: 'mitotest1',
          tokenType: TokenType.Cw20,
        },
      ],
    },
    
    RICE: {
      name: 'RICE',
      logo: 'RICE.jepg',
  
      tokenFactories: [
        {
          creator: 'inj1mt876zny9j6xae25h7hl7zuqf7gkx8q63k0426',
          symbol: 'RICE',
          decimals: 12,
        },
      ],
    },
  } as Record<string, TokenMeta>)
