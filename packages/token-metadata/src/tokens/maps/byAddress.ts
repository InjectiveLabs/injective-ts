import { TokenMeta } from '../../types'
import tokens from '../tokens'

export default {
  [tokens.BTC.address.toLowerCase()]: tokens.BTC,
  [tokens.WETH.address.toLowerCase()]: tokens.WETH,
  [tokens.INJ.address.toLowerCase()]: tokens.INJ,
  [tokens.USDT.address.toLowerCase()]: tokens.USDT,
  [tokens.USDC.address.toLowerCase()]: tokens.USDC,
  [tokens.GRT.address.toLowerCase()]: tokens.GRT,
  [tokens.SNX.address.toLowerCase()]: tokens.SNX,
  [tokens.DAI.address.toLowerCase()]: tokens.DAI,
  [tokens.BNB.address.toLowerCase()]: tokens.BNB,
  [tokens.AAVE.address.toLowerCase()]: tokens.AAVE,
  [tokens.YFI.address.toLowerCase()]: tokens.YFI,
  [tokens.COMP.address.toLowerCase()]: tokens.COMP,
  [tokens.ZRX.address.toLowerCase()]: tokens.ZRX,
  [tokens.MATIC.address.toLowerCase()]: tokens.MATIC,
  [tokens.UNI.address.toLowerCase()]: tokens.UNI,
  [tokens.LINK.address.toLowerCase()]: tokens.LINK,
  [tokens.SUSHI.address.toLowerCase()]: tokens.SUSHI,
} as Record<string, TokenMeta>
