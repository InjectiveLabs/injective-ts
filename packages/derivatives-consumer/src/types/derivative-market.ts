import {
  DerivativeMarketInfo as GrpcDerivativeMarketInfo,
  DerivativeLimitOrder as GrpcDerivativeMarketOrder,
  DerivativeTrade as GrpcDerivativeTrade,
  DerivativePosition as GrpcDerivativePosition,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { TokenMeta as GrpcTokenMeta } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import {
  DerivativeOrder as GrpcDerivativeOrder,
  OrderInfo as GrpcOrderInfo,
  DerivativeMarket as GrpcDerivativeMarket,
  DerivativeLimitOrder as GrpcDerivativeLimitOrder,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'

export enum DerivativeOrderType {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
}

export enum DerivativeOrderState {
  Filled = 'filled',
  Unfilled = 'unfilled',
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

export interface DerivativeMarket {
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

export interface DerivativeMarketOrder {
  orderHash: string
  orderType: DerivativeOrderType
  marketId: string
  subaccountId: string
  price: string
  state: DerivativeOrderState
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

export interface DerivativeMarketTrade extends PriceLevel {
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

export interface DerivativeLimitOrderParams {
  orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap]
  triggerPrice?: string
  feeRecipient: string
  price: string
  quantity: string
}

export interface DerivativeOrderCancelParams {
  orderHash: string
}

export {
  GrpcTokenMeta,
  GrpcDerivativePosition,
  GrpcOrderTypeMap,
  GrpcOrderInfo,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeMarketOrder,
  GrpcDerivativeMarket,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
  GrpcDerivativeOrder,
}
