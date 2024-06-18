import { Change } from '../client/types/common'
import { UiSpotMarketSummary } from '../client/types/spot'

export const zeroSpotMarketSummary = (
  marketId: string,
): UiSpotMarketSummary => ({
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
