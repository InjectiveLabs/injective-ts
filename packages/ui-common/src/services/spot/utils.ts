import { Change } from '../../types'
import { SpotMarketMap, SpotOrderSide, UiSpotMarketSummary } from './types'

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

export const spotOrderTypeToGrpcOrderType = (
  orderType: SpotOrderSide,
): SpotMarketMap => {
  switch (orderType) {
    case SpotOrderSide.Unspecified:
      return SpotMarketMap.UNSPECIFIED
    case SpotOrderSide.Buy:
      return SpotMarketMap.BUY
    case SpotOrderSide.Sell:
      return SpotMarketMap.SELL
    case SpotOrderSide.StopBuy:
      return SpotMarketMap.STOP_BUY
    case SpotOrderSide.TakeBuy:
      return SpotMarketMap.TAKE_BUY
    case SpotOrderSide.TakeSell:
      return SpotMarketMap.TAKE_SELL
    default:
      return SpotMarketMap.BUY
  }
}
