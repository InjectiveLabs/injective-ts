import {
  UiDerivativeMarketSummary,
  DerivativeMarketMap,
  DerivativeOrderSide,
} from './types'
import { Change } from '../../types'

export const derivativeOrderTypeToGrpcOrderType = (
  orderType: DerivativeOrderSide,
): DerivativeMarketMap => {
  switch (orderType) {
    case DerivativeOrderSide.Unspecified:
      return DerivativeMarketMap.UNSPECIFIED
    case DerivativeOrderSide.Buy:
      return DerivativeMarketMap.BUY
    case DerivativeOrderSide.Sell:
      return DerivativeMarketMap.SELL
    case DerivativeOrderSide.StopBuy:
      return DerivativeMarketMap.STOP_BUY
    case DerivativeOrderSide.StopSell:
      return DerivativeMarketMap.STOP_SELL
    case DerivativeOrderSide.TakeBuy:
      return DerivativeMarketMap.TAKE_BUY
    case DerivativeOrderSide.TakeSell:
      return DerivativeMarketMap.TAKE_SELL
    default:
      return DerivativeMarketMap.BUY
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
