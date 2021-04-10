import {
  SpotMarketInfo as GrpcSpotMarketInfo,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotMarketTrade as GrpcSpotMarketTrade,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'

export enum TradeExecutionType {
  Market = 'market',
  LimitFill = 'limitFill',
  LimitMatchRestingOrder = 'limitMatchRestingOrder',
  LimitMatchNewOrder = 'limitMatchNewOrder',
}

export enum TradeDirection {
  Buy = 'buy',
  Sell = 'sell',
  Long = 'long',
  Short = 'short',
}

export enum SpotOrderType {
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
}

export interface UiSpotMarket {
  marketId: string
  marketStatus: string
  ticker: string
  baseDenom: string
  quoteDenom: string
  makerFeeRate: string
  takerFeeRate: string
  serviceProviderFee: string
}

export interface UiSpotMarketOrder {
  orderHash: string
  orderType: SpotOrderType
  marketId: string
  subaccountId: string
  price: string
  quantity: string
  unfilledQuantity: string
  triggerPrice: string
  feeRecipient: string
}

export interface UiPriceLevel {
  p: string // Price
  q: string // Quantity
  t: string // Timestamp
}

export interface UiSpotMarketTrade {
  orderHash: string
  subaccountId: string
  marketId: string
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  price?: UiPriceLevel
  fee: string
}

export interface UiOrderbook {
  buys: UiPriceLevel[]
  sells: UiPriceLevel[]
}

export { GrpcSpotMarketInfo, GrpcSpotMarketOrder, GrpcSpotMarketTrade }
