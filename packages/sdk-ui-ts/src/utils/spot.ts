import { Change } from '../client/types/common'
import {
  SpotOrderMap,
  SpotOrderSide,
  UiSpotMarketSummary,
} from '../client/types/spot'

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
): SpotOrderMap => {
  switch (orderType) {
    case SpotOrderSide.Unspecified:
      return SpotOrderMap.UNSPECIFIED
    case SpotOrderSide.Buy:
      return SpotOrderMap.BUY
    case SpotOrderSide.Sell:
      return SpotOrderMap.SELL
    case SpotOrderSide.StopBuy:
      return SpotOrderMap.STOP_BUY
    case SpotOrderSide.TakeBuy:
      return SpotOrderMap.TAKE_BUY
    case SpotOrderSide.TakeSell:
      return SpotOrderMap.TAKE_SELL
    case SpotOrderSide.BuyPO:
      return SpotOrderMap.BUY_PO
    case SpotOrderSide.SellPO:
      return SpotOrderMap.SELL_PO
    default:
      return SpotOrderMap.BUY
  }
}
