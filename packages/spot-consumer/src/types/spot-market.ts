import {
  SpotMarketInfo as GrpcSpotMarketInfo,
  SpotLimitOrder as GrpcSpotLimitOrder,
  SpotTrade as GrpcSpotTrade,
  TokenMeta as GrpcTokenMeta,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import {
  OrderInfo as GrpcOrderInfo,
  SpotMarket as GrpcSpotMarket,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'

export enum SpotOrderSide {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
}

export enum SpotOrderState {
  Unfilled = 'unfilled',
  Booked = 'booked',
  PartialFilled = 'partial_filled',
  Filled = 'filled',
  Canceled = 'canceled',
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
  minPriceTickSize: number
  minQuantityTickSize: number
}

export interface SpotLimitOrder {
  orderHash: string
  orderSide: SpotOrderSide
  marketId: string
  subaccountId: string
  price: string
  state: SpotOrderState
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

export interface SpotTrade extends PriceLevel {
  orderHash: string
  subaccountId: string
  marketId: string
  executedAt: number
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  fee: string
  feeRecipient: string
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
}

export interface BatchSpotOrderCancelParams {
  orderHash: string
  subaccountId: string
  marketId: string
}

export {
  GrpcTokenMeta,
  GrpcOrderTypeMap,
  GrpcOrderInfo,
  GrpcSpotMarketInfo,
  GrpcSpotMarket,
  GrpcSpotLimitOrder,
  GrpcSpotTrade,
}
