import { UiDerivativeMarketSummary } from '../client/types/derivatives'
import { Change } from '../client/types/common'

export const zeroDerivativeMarketSummary = (
  marketId: string,
): UiDerivativeMarketSummary => ({
  marketId,
  change: NaN,
  high: NaN,
  low: NaN,
  open: NaN,
  price: NaN,
  volume: NaN,
  lastPrice: NaN,
  lastPriceChange: Change.NoChange,
})
