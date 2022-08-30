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
  BinaryOptionsMarketInfo as GrpcBinaryOptionsMarketInfo,
  DerivativeOrderHistory as GrpcDerivativeOrderHistory,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'
import { GrpcOrderType } from '../../chain/types/exchange'
import { TokenMeta } from '@injectivelabs/token-metadata'

export enum DerivativeOrderSide {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
  BuyPO = 'buy_po',
  SellPO = 'sell_po',
}

export enum DerivativeOrderState {
  Unfilled = 'unfilled',
  Booked = 'booked',
  PartialFilled = 'partial_filled',
  PartiallyFilled = 'partially_filled',
  Filled = 'filled',
  Canceled = 'canceled',
  Triggered = 'triggered'
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
  aggregateReduceOnlyQuantity: string,
  updatedAt: number
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

export interface BaseDerivativeMarket {
  oracleType: string
  marketId: string
  marketStatus: string
  ticker: string
  quoteDenom: string
  makerFeeRate: string
  quoteToken: TokenMeta | undefined
  takerFeeRate: string
  serviceProviderFee: string
  minPriceTickSize: number | string
  minQuantityTickSize: number | string
}

export interface PerpetualMarket extends BaseDerivativeMarket {
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  oracleBase: string
  oracleQuote: string
  perpetualMarketInfo?: PerpetualMarketInfo
  perpetualMarketFunding?: PerpetualMarketFunding
}

export interface ExpiryFuturesMarket extends BaseDerivativeMarket {
  initialMarginRatio: string
  maintenanceMarginRatio: string
  isPerpetual: boolean
  oracleBase: string
  oracleQuote: string
  expiryFuturesMarketInfo?: ExpiryFuturesMarketInfo
}

export interface BinaryOptionsMarket
  extends Omit<
    BaseDerivativeMarket,
    'minPriceTickSize' | 'minQuantityTickSize'
  > {
  oracleSymbol: string
  oracleProvider: string
  oracleScaleFactor: number
  expirationTimestamp: number
  settlementTimestamp: number
  serviceProviderFee: string
  minPriceTickSize: string
  minQuantityTickSize: string
  settlementPrice: string
}

export type DerivativeMarket =
  | PerpetualMarket
  | ExpiryFuturesMarket
  | BinaryOptionsMarket

export type DerivativeMarketWithoutBinaryOptions =
  | PerpetualMarket
  | ExpiryFuturesMarket

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
  createdAt: number
  updatedAt: number
  orderNumber: number
  orderType: string
  isConditional: boolean
  triggerAt: number
  placedOrderHash: string
  executionType: string
}

export interface DerivativeOrderHistory {
  orderHash: string
  marketId: string
  isActive: boolean
  subaccountId: string
  executionType: string
  orderType: string
  price: string
  triggerPrice: string
  quantity: string
  filledQuantity: string
  state: string
  createdAt: number
  updatedAt: number
  isReduceOnly: boolean
  direction: string
  isConditional: boolean
  triggerAt: number
  placedOrderHash: string
  margin: string
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

export interface DerivativeLimitOrderParams {
  orderType: GrpcOrderType
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
  GrpcDerivativePosition,
  GrpcFundingPayment,
  GrpcFundingRate,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcPerpetualMarketInfo,
  GrpcPerpetualMarketFunding,
  GrpcExpiryFuturesMarketInfo,
  GrpcDerivativeTrade,
  GrpcPositionDelta,
  GrpcBinaryOptionsMarketInfo,
  GrpcDerivativeOrderHistory,
}
