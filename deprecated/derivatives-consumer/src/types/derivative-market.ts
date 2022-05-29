import {
  DerivativeMarketInfo as GrpcDerivativeMarketInfo,
  DerivativeLimitOrder as GrpcDerivativeLimitOrder,
  DerivativeTrade as GrpcDerivativeTrade,
  DerivativePosition as GrpcDerivativePosition,
  PositionDelta as GrpcPositionDelta,
  PerpetualMarketInfo as GrpcPerpetualMarketInfo,
  PerpetualMarketFunding as GrpcPerpetualMarketFunding,
  ExpiryFuturesMarketInfo as GrpcExpiryFuturesMarketInfo,
  FundingPayment as GrpcFundingPayment,
  FundingRate as GrpcFundingRate,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { TokenMeta as GrpcTokenMeta } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import {
  OrderInfo as GrpcOrderInfo,
  DerivativeMarket as GrpcDerivativeMarket,
  OrderTypeMap as GrpcOrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'

export enum DerivativeOrderSide {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
}

export enum DerivativeOrderState {
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
  liquidationPrice: string
  markPrice: string
  ticker: string
  aggregateReduceOnlyQuantity: string
}

export interface PerpetualMarketInfo {
  hourlyFundingRateCap: string
  hourlyInterestRate: string
  nextFundingTimestamp: number
  fundingInterval: number
}

export interface PerpetualMarketFunding {
  cumulativeFunding: string
  cumulativePrice: string
  lastTimestamp: number
}

export interface ExpiryFuturesMarketInfo {
  expirationTimestamp: number
  settlementPrice: string
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
  minPriceTickSize: number
  minQuantityTickSize: number
  perpetualMarketInfo?: PerpetualMarketInfo
  perpetualMarketFunding?: PerpetualMarketFunding
  expiryFuturesMarketInfo?: ExpiryFuturesMarketInfo
}

export interface DerivativeLimitOrder {
  orderHash: string
  orderSide: DerivativeOrderSide
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
  feeRecipient: string
  isLiquidation: boolean
  payout: string
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
  margin: string
  quantity: string
}

export interface DerivativeOrderCancelParams {
  orderHash: string
}

export interface BatchDerivativeOrderCancelParams {
  marketId: string
  subaccountId: string
  orderHash: string
}

export interface FundingPayment {
  marketId: string
  subaccountId: string
  amount: string
  timestamp: number
}

export interface FundingRate {
  marketId: string
  rate: string
  timestamp: number
}

export {
  GrpcTokenMeta,
  GrpcDerivativePosition,
  GrpcOrderTypeMap,
  GrpcOrderInfo,
  GrpcFundingPayment,
  GrpcFundingRate,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeMarket,
  GrpcDerivativeLimitOrder,
  GrpcPerpetualMarketInfo,
  GrpcPerpetualMarketFunding,
  GrpcExpiryFuturesMarketInfo,
  GrpcDerivativeTrade,
  GrpcPositionDelta,
}
