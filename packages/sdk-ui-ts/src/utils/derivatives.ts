import {
  UiDerivativeMarketSummary,
  DerivativeOrderMap,
  DerivativeOrderSide,
} from '../client/types/derivatives'
import { Change } from '../client/types/common'

export const derivativeOrderTypeToGrpcOrderType = (
  orderType: DerivativeOrderSide,
): DerivativeOrderMap => {
  switch (orderType) {
    case DerivativeOrderSide.Unspecified:
      return DerivativeOrderMap.UNSPECIFIED
    case DerivativeOrderSide.Buy:
      return DerivativeOrderMap.BUY
    case DerivativeOrderSide.Sell:
      return DerivativeOrderMap.SELL
    case DerivativeOrderSide.StopBuy:
      return DerivativeOrderMap.STOP_BUY
    case DerivativeOrderSide.StopSell:
      return DerivativeOrderMap.STOP_SELL
    case DerivativeOrderSide.TakeBuy:
      return DerivativeOrderMap.TAKE_BUY
    case DerivativeOrderSide.TakeSell:
      return DerivativeOrderMap.TAKE_SELL
    case DerivativeOrderSide.BuyPO:
      return DerivativeOrderMap.BUY_PO
    case DerivativeOrderSide.SellPO:
      return DerivativeOrderMap.SELL_PO
    default:
      return DerivativeOrderMap.BUY
  }
}

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
