import {
  SpotMarketInfo as GrpcSpotMarketInfo,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotMarketTrade as GrpcSpotMarketTrade,
  TokenMeta as GrpcTokenMeta,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import {
  SpotOrder as GrpcSpotOrder,
  OrderInfo as GrpcOrderInfo,
  SpotMarket as GrpcSpotMarket,
  SpotLimitOrder as GrpcSpotLimitOrder,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'

export enum SpotOrderType {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
}

export interface TokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  decimals: number
  updatedAt: number
}

export interface SpotMarket {
  marketId: string
  marketStatus: string
  ticker: string
  baseDenom: string
  quoteDenom: string
  makerFeeRate: string
  quoteToken: TokenMeta | undefined
  baseToken: TokenMeta | undefined
  takerFeeRate: string
  serviceProviderFee: string
  maxPriceScaleDecimals: number
  maxQuantityScaleDecimals: number
}

export interface SpotMarketOrder {
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
export interface SpotLimitOrder {
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

export interface PriceLevel {
  price: string
  quantity: string
  timestamp: number
}

export interface SpotMarketTrade extends PriceLevel {
  orderHash: string
  subaccountId: string
  marketId: string
  executedAt: number
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  fee: string
}

export interface Orderbook {
  buys: PriceLevel[]
  sells: PriceLevel[]
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
  GrpcTokenMeta,
  GrpcOrderTypeMap,
  GrpcOrderInfo,
  GrpcSpotMarketInfo,
  GrpcSpotMarketOrder,
  GrpcSpotMarket,
  GrpcSpotLimitOrder,
  GrpcSpotMarketTrade,
  GrpcSpotOrder,
}
