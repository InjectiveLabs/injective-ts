import {
  DerivativeMarketInfo as GrpcDerivativeMarketInfo,
  DerivativeLimitOrder as GrpcDerivativeLimitOrder,
  DerivativeTrade as GrpcDerivativeTrade,
  DerivativePosition as GrpcDerivativePosition,
  PositionDelta as GrpcPositionDelta,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { TokenMeta as GrpcTokenMeta } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import {
  OrderInfo as GrpcOrderInfo,
  DerivativeMarket as GrpcDerivativeMarket,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'

export enum DerivativeOrderType {
  Unspecified = 'unspecified',
  Long = 'long',
  Short = 'short',
  StopLong = 'stop_long',
  StopShort = 'stop_short',
  TakeLong = 'take_long',
  TakeShort = 'take_short',
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

export interface PositionDelta {
  tradeDirection: TradeDirection
  executionPrice: string
  executionQuantity: string
  executionMargin: string
}

export interface Position {
  marketId: string
  subaccountId: string
  direction: TradeDirection
  quantity: string
  entryPrice: string
  margin: string
  holdQuantity: string
  liquidationPrice: string
  markPrice: string
  impliedPnl: string
  leverage: string
}

export interface DerivativeMarket {
  oracleBase: string
  oracleQuote: string
  oracleType: string
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  marketId: string
  marketStatus: string
  ticker: string
  quoteDenom: string
  makerFeeRate: string
  quoteToken: TokenMeta | undefined
  takerFeeRate: string
  serviceProviderFee: string
  minPriceTickSize: string
  minQuantityTickSize: string
}

export interface DerivativeLimitOrder {
  orderHash: string
  orderType: string
  marketId: string
  subaccountId: string
  isReduceOnly: boolean
  margin: string
  price: string
  quantity: string
  unfilledQuantity: string
  triggerPrice: string
  feeRecipient: string
  state: DerivativeOrderState
}

export interface PriceLevel {
  price: string
  quantity: string
  timestamp: number
}

export interface DerivativeTrade extends PositionDelta {
  orderHash: string
  subaccountId: string
  marketId: string
  executedAt: number
  tradeExecutionType: TradeExecutionType
  tradeDirection: TradeDirection
  fee: string
  isLiquidation: boolean
  payout: string
}

export interface Orderbook {
  longs: PriceLevel[]
  shorts: PriceLevel[]
}

export interface DerivativeLimitOrderParams {
  orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap]
  triggerPrice?: string
  feeRecipient: string
  price: string
  margin: string
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
  GrpcDerivativeMarket,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
  GrpcPositionDelta,
}
