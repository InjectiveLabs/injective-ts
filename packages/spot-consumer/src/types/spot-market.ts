import {
  SpotMarketInfo as GrpcSpotMarketInfo,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotMarketTrade as GrpcSpotMarketTrade,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import {
  SpotOrder as GrpcSpotOrder,
  OrderInfo as GrpcOrderInfo,
  SpotMarket as GrpcSpotMarket,
  SpotLimitOrder as GrpcSpotLimitOrder,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'

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
  maxPriceScaleDecimals: number
  maxQuantityScaleDecimals: number
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

// TODO
export interface UiSpotLimitOrder {
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
  price: string
  quantity: string
  timestamp: string
}

export interface UiSpotMarketTrade extends UiPriceLevel {
  orderHash: string
  subaccountId: string
  marketId: string
  executedAt: string
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  fee: string
}

export interface UiOrderbook {
  buys: UiPriceLevel[]
  sells: UiPriceLevel[]
}

export interface SpotLimitOrderParams {
  orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap]
  triggerPrice?: string
  feeRecipient: string
  price: string
  quantity: string
}

export interface SpotOrderCancelParams {
  orderHash: string
  isBuy: boolean
}

export {
  GrpcOrderTypeMap,
  GrpcOrderInfo,
  GrpcSpotMarketInfo,
  GrpcSpotMarketOrder,
  GrpcSpotMarket,
  GrpcSpotLimitOrder,
  GrpcSpotMarketTrade,
  GrpcSpotOrder,
}
