import tokens from './tokens'
import {
  TokenSource,
  TokenMetaBase,
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
      tokenFactories: [
        {
          symbol: 'wBTC',
          creator: 'inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c',
          decimals: 8,
        },
      ],
    },

    ATOM: {
      ...tokens.ATOM,
      tokenFactories: [
        {
          symbol: 'ATOM',
          creator: 'inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c',
          decimals: 8,
        },
      ],
    },

    INJ: {
      ...tokens.INJ,
      erc20: {
        ...tokens.INJ.erc20,
        address: '0x5512c04B6FF813f3571bDF64A1d74c98B5257332',
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
      tokenFactories: [
        {
          symbol: 'wETH',
          creator: 'inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c',
          decimals: 8,
        },
      ],
    },

    ASTRO: {
      ...tokens.ASTRO,
      ibcs: [
        {
          ...(tokens.ASTRO.ibcs ? tokens.ASTRO.ibcs[0] : {}),
          hash: 'E8AC6B792CDE60AB208CA060CA010A3881F682A7307F624347AB71B6A0B0BF89',
          path: 'transfer/channel-13',
          channelId: 'channel-13',
          baseDenom: 'ASTRO',
        },
      ],
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
      tokenFactories: [
        {
          symbol: 'USDC',
          creator: 'inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c',
          decimals: 6,
        },
      ],
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
      ],
    },

    MATIC: {
      ...tokens.MATIC,
      erc20: {
        ...tokens.MATIC.erc20,
        address: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
      },
      tokenFactories: [
        {
          symbol: 'MATIC',
          creator: 'inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c',
          decimals: 18,
        },
      ],
    },

    STINJ: {
      ...tokens.STINJ,

      tokenFactories: [
        {
          symbol: 'STINJ',
          creator: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
          decimals: 18,
        },
      ],
    },

    hINJ: {
      ...tokens.hINJ,

      cw20s: [
        ...(tokens.hINJ.cw20s || []),
        {
          symbol: 'hINJ',
          decimals: 18,
          address: 'inj1mz7mfhgx8tuvjqut03qdujrkzwlx9xhcj6yldc',
        },
      ],
    },

    HDRO: {
      ...tokens.HDRO,

      tokenFactories: [
        ...(tokens.HDRO.tokenFactories || []),
        {
          creator: 'inj1pk7jhvjj2lufcghmvr7gl49dzwkk3xj0uqkwfk',
          symbol: 'HDRO',
          decimals: 6,
        },
      ],
    },
    KIRA: {
      ...tokens.KIRA,

      tokenFactories: [
        ...(tokens.KIRA.tokenFactories || []),
        {
          creator: 'inj1jfuyujpvvkxq4566r3z3tv3jdy29pqra5ln0yk',
          symbol: 'KIRA',
          decimals: 6,
        },
      ],
    },
  } as Record<string, TokenMetaBase>)
