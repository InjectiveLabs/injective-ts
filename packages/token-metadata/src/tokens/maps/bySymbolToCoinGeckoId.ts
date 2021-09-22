import tokens from '../tokens'

export default {
  [tokens.wBTC.symbol.toLowerCase()]: tokens.wBTC.coinGeckoId,
  [tokens.WETH.symbol.toLowerCase()]: tokens.WETH.coinGeckoId,
  [tokens.INJ.symbol.toLowerCase()]: tokens.INJ.coinGeckoId,
  [tokens.USDT.symbol.toLowerCase()]: tokens.USDT.coinGeckoId,
  [tokens.USDC.symbol.toLowerCase()]: tokens.USDC.coinGeckoId,
  [tokens.GRT.symbol.toLowerCase()]: tokens.GRT.coinGeckoId,
  [tokens.SNX.symbol.toLowerCase()]: tokens.SNX.coinGeckoId,
  [tokens.DAI.symbol.toLowerCase()]: tokens.DAI.coinGeckoId,
  [tokens.BNB.symbol.toLowerCase()]: tokens.BNB.coinGeckoId,
  [tokens.AAVE.symbol.toLowerCase()]: tokens.AAVE.coinGeckoId,
  [tokens.YFI.symbol.toLowerCase()]: tokens.YFI.coinGeckoId,
  [tokens.COMP.symbol.toLowerCase()]: tokens.COMP.coinGeckoId,
  [tokens.ZRX.symbol.toLowerCase()]: tokens.ZRX.coinGeckoId,
  [tokens.MATIC.symbol.toLowerCase()]: tokens.MATIC.coinGeckoId,
  [tokens.UNI.symbol.toLowerCase()]: tokens.UNI.coinGeckoId,
  [tokens.LINK.symbol.toLowerCase()]: tokens.LINK.coinGeckoId,
  [tokens.SUSHI.symbol.toLowerCase()]: tokens.SUSHI.coinGeckoId,
  [tokens.AXS.symbol.toLowerCase()]: tokens.AXS.coinGeckoId,
} as Record<string, string>
