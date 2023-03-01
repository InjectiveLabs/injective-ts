import { TokenMeta, Erc20TokenMeta } from '../../types'
import tokens from '../tokens'

export const devnetSymbolToAddressMap = {
  INJ: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
}

export const devnet1SymbolToAddressMap = {
  INJ: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
}

export const devnet2SymbolToAddressMap = {
  INJ: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
}

const formatTokenMeta = (
  symbol: string,
  erc20AddressFromMap?: string,
): TokenMeta => {
  const tokenMeta = tokens[symbol]

  if (!tokens[symbol].erc20 || !erc20AddressFromMap) {
    return tokenMeta
  }

  return {
    ...tokenMeta,
    erc20: {
      ...(tokens[symbol].erc20 as Erc20TokenMeta),
      ...(erc20AddressFromMap ? { address: erc20AddressFromMap } : {}),
    },
  }
}

export const getTokensBySymbolForDevnet = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbol = symbol as keyof typeof devnetSymbolToAddressMap
      const erc20AddressFromMap = devnetSymbolToAddressMap[tokenSymbol]

      return {
        ...result,
        [tokenSymbol.toUpperCase()]: formatTokenMeta(
          symbol,
          erc20AddressFromMap,
        ),
      }
    },
    {},
  ) as Record<string, TokenMeta>

export const getTokensBySymbolForDevnet1 = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbol = symbol as keyof typeof devnet1SymbolToAddressMap
      const erc20AddressFromMap = devnet1SymbolToAddressMap[tokenSymbol]

      return {
        ...result,
        [tokenSymbol.toUpperCase()]: formatTokenMeta(
          symbol,
          erc20AddressFromMap,
        ),
      }
    },
    {},
  ) as Record<string, TokenMeta>

export const getTokensBySymbolForDevnet2 = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbol = symbol as keyof typeof devnet2SymbolToAddressMap
      const erc20AddressFromMap = devnet2SymbolToAddressMap[tokenSymbol]

      return {
        ...result,
        [tokenSymbol.toUpperCase()]: formatTokenMeta(
          symbol,
          erc20AddressFromMap,
        ),
      }
    },
    {},
  ) as Record<string, TokenMeta>
