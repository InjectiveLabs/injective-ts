import {
  UiBinaryOptionsMarketSummary,
  BinaryOptionsOrderMap,
  BinaryOptionsOrderSide,
} from '../client/types/binary-options'
import { Change } from '../client/types/common'

export const binaryOptionsOrderTypeToGrpcOrderType = (
  orderType: BinaryOptionsOrderSide,
): BinaryOptionsOrderMap => {
  switch (orderType) {
    case BinaryOptionsOrderSide.Unspecified:
      return BinaryOptionsOrderMap.UNSPECIFIED
    case BinaryOptionsOrderSide.Buy:
      return BinaryOptionsOrderMap.BUY
    case BinaryOptionsOrderSide.Sell:
      return BinaryOptionsOrderMap.SELL
    case BinaryOptionsOrderSide.StopBuy:
      return BinaryOptionsOrderMap.STOP_BUY
    case BinaryOptionsOrderSide.StopSell:
      return BinaryOptionsOrderMap.STOP_SELL
    case BinaryOptionsOrderSide.TakeBuy:
      return BinaryOptionsOrderMap.TAKE_BUY
    case BinaryOptionsOrderSide.TakeSell:
      return BinaryOptionsOrderMap.TAKE_SELL
    case BinaryOptionsOrderSide.BuyPO:
      return BinaryOptionsOrderMap.BUY_PO
    case BinaryOptionsOrderSide.SellPO:
      return BinaryOptionsOrderMap.SELL_PO
    default:
      return BinaryOptionsOrderMap.BUY
  }
}

export const zeroBinaryOptionsMarketSummary = (
  marketId: string,
): UiBinaryOptionsMarketSummary => ({
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
