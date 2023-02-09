import { TokenMeta } from '../../types'
import tokens from '../tokens'

export const testnetSymbolToErc20AddressMap = {
  INJ: '0x85AbEac4F09762e28a49D7dA91260A46766F4F79',
  USDT: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
  APE: '0x44C21afAaF20c270EBbF5914Cfc3b5022173FEB7',
  USDC: '0x85AbEac4F09762e28a49D7dA91260A46766F4F79',
  wETH: '0xdB309Bb079EB419C18fe7D568c61cD2FdB65D9aF',
}

export const testnetSymbolToCw20AddressMap = {
  SOL: 'inj12ngevx045zpvacus9s6anr258gkwpmthnz80e9',
  USDCet: 'inj12sqy9uzzl3h3vqxam7sz9f0yvmhampcgesh3qw',
}

export const tokensBySymbolForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenSymbol = token as keyof typeof testnetSymbolToErc20AddressMap
  const testnetAddressFromMap = testnetSymbolToErc20AddressMap[tokenSymbol]

  const tokenMeta = tokens[token] as TokenMeta

  if (testnetAddressFromMap) {
    if (!tokenMeta.erc20) {
      return result
    }

    return {
      ...result,
      [token.toUpperCase()]: {
        ...tokenMeta,
        erc20: {
          ...tokenMeta.erc20,
          address: testnetAddressFromMap,
        },
      },
    }
  }

  const cw20TokenKey = token as keyof typeof testnetSymbolToCw20AddressMap
  const cw20TestnetAddressFromMap = testnetSymbolToCw20AddressMap[cw20TokenKey]

  if (cw20TestnetAddressFromMap) {
    if (!tokenMeta.cw20 && !tokenMeta.cw20s) {
      return result
    }

    if (tokenMeta.cw20) {
      return {
        ...result,
        [token.toUpperCase()]: {
          ...tokenMeta,
          cw20: {
            ...tokenMeta.cw20,
            address: cw20TestnetAddressFromMap,
          },
        },
      }
    }

    if (tokenMeta.cw20s) {
      const cw20Maps = tokenMeta.cw20s.map((cw20) =>
        cw20.symbol !== cw20TokenKey
          ? cw20
          : {
              ...cw20,
              address: cw20TestnetAddressFromMap,
            },
      )

      return {
        ...result,
        [token.toUpperCase()]: {
          ...tokenMeta,
          cw20: cw20Maps,
        },
      }
    }

    return result
  }

  return result
}, {}) as Record<string, TokenMeta>
