import { TokenMeta } from '../../types'
import tokens from '../tokens'

export default {
  INJ: {
    ...tokens.INJ,
    address: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
  },
  USDT: {
    ...tokens.USDT,
    address: '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08',
  },
  USDC: {
    ...tokens.USDC,
    address: '0xc83dcea3ec44b7d3ec70690bab1e6292a80e6dc3',
  },
  DAI: {
    ...tokens.DAI,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  BNB: {
    ...tokens.BNB,
    address: '0xf833cad2b46b49ef96244b974aaff8b80ff84fdd',
  },
  AAVE: {
    ...tokens.AAVE,
    address: '0x69bed9289eb970f021ba86fec646f9c427e0320a',
  },
  YFI: {
    ...tokens.YFI,
    address: '0x6acd36eb845a8f905512d5f259c1233242349266',
  },
  ZRX: {
    ...tokens.ZRX,
    address: '0xb4ef9d74108980fece40d9205c3d1c94090a3b50',
  },
  MATIC: {
    ...tokens.MATIC,
    address: '0x724d7e46bf2cc15de3932f547a60018c286312a7',
  },
  UNI: {
    ...tokens.UNI,
    address: '0x138b989687da853a561d4ede88d8281434211780',
  },
  LINK: {
    ...tokens.LINK,
    address: '0xc843f43093f8d32c01a065ed2a0a34fb54baaf3f',
  },
} as Record<string, TokenMeta>
