import { TokenMeta } from '../../types'
import tokens from '../tokens'

export default {
  '0xa3a9029b8120e2f09b194df4a249a24db461e573': {
    ...tokens.INJ,
    address: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
  },
  '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08': {
    ...tokens.USDT,
    address: '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08',
  },
  '0xc83dcea3ec44b7d3ec70690bab1e6292a80e6dc3': {
    ...tokens.USDC,
    address: '0xc83dcea3ec44b7d3ec70690bab1e6292a80e6dc3',
  },
  '0x9566902a13ce8ad8c730743e54ca0ff3657470a0': {
    ...tokens.DAI,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  '0xf833cad2b46b49ef96244b974aaff8b80ff84fdd': {
    ...tokens.BNB,
    address: '0xf833cad2b46b49ef96244b974aaff8b80ff84fdd',
  },
  '0x69bed9289eb970f021ba86fec646f9c427e0320a': {
    ...tokens.AAVE,
    address: '0x69bed9289eb970f021ba86fec646f9c427e0320a',
  },
  '0x6acd36eb845a8f905512d5f259c1233242349266': {
    ...tokens.YFI,
    address: '0x6acd36eb845a8f905512d5f259c1233242349266',
  },
  '0xb4ef9d74108980fece40d9205c3d1c94090a3b50': {
    ...tokens.ZRX,
    address: '0xb4ef9d74108980fece40d9205c3d1c94090a3b50',
  },
  '0x724d7e46bf2cc15de3932f547a60018c286312a7': {
    ...tokens.MATIC,
    address: '0x724d7e46bf2cc15de3932f547a60018c286312a7',
  },
  '0x138b989687da853a561d4ede88d8281434211780': {
    ...tokens.UNI,
    address: '0x138b989687da853a561d4ede88d8281434211780',
  },
  '0xc843f43093f8d32c01a065ed2a0a34fb54baaf3f': {
    ...tokens.LINK,
    address: '0xc843f43093f8d32c01a065ed2a0a34fb54baaf3f',
  },
  '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b': {
    ...tokens.AXS,
    address: '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b',
  },
  [tokens.INJ.address]: {
    ...tokens.INJ,
    address: '0xa3a9029b8120e2f09b194df4a249a24db461e573',
  },
  [tokens.USDT.address]: {
    ...tokens.USDT,
    address: '0x69efcb62d98f4a6ff5a0b0cfaa4aabb122e85e08',
  },
  [tokens.USDC.address]: {
    ...tokens.USDC,
    address: '0xc83dcea3ec44b7d3ec70690bab1e6292a80e6dc3',
  },
  [tokens.DAI.address]: {
    ...tokens.DAI,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.BNB.address]: {
    ...tokens.BNB,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.BTC.address]: {
    ...tokens.BTC,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.wBTC.address]: {
    ...tokens.wBTC,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.AAVE.address]: {
    ...tokens.AAVE,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.UNI.address]: {
    ...tokens.UNI,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.MATIC.address]: {
    ...tokens.MATIC,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.LINK.address]: {
    ...tokens.LINK,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.AXS.address]: {
    ...tokens.AXS,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
  [tokens.ZRX.address]: {
    ...tokens.ZRX,
    address: '0x9566902a13ce8ad8c730743e54ca0ff3657470a0',
  },
} as Record<string, TokenMeta>
