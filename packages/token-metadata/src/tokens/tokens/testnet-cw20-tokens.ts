import {
  TokenType,
  Cw20TokenSource,
  Cw20TokenMetaWithSource,
} from '../../types'

export default {
  WBTC: {
    decimals: 8,
    symbol: 'wBTC',
    source: Cw20TokenSource.Cosmos,
    address: 'wbtc',
    tokenType: TokenType.Cw20,
  },
  ATOM: {
    decimals: 8,
    symbol: 'ATOM',
    source: Cw20TokenSource.Cosmos,
    address: 'atom',
    tokenType: TokenType.Cw20,
  },
  WETH: {
    decimals: 8,
    symbol: 'WETH',
    source: Cw20TokenSource.Cosmos,
    address: 'weth',
    tokenType: TokenType.Cw20,
  },
} as Record<string, Cw20TokenMetaWithSource>
