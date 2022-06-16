import {
  DerivativeLimitOrder as GrpcBinaryOptionsLimitOrder,
  DerivativeTrade as GrpcBinaryOptionsTrade,
  DerivativePosition as GrpcBinaryOptionsPosition,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { BinaryOptionsMarketInfo as GrpcBinaryOptionsMarketInfo } from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'
import { GrpcOrderType } from '../../chain/types/exchange'
import { TokenMeta } from '@injectivelabs/token-metadata'
import { PositionDelta } from './derivatives'

export enum BinaryOptionsOrderSide {
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

export enum BinaryOptionsOrderState {
  Unfilled = 'unfilled',
  Booked = 'booked',
  PartialFilled = 'partial_filled',
  Filled = 'filled',
  Canceled = 'canceled',
}

export interface BinaryOptionsMarket {
  marketId: string
  marketStatus: string
  ticker: string
  oracleSymbol: string
  oracleProvider: string
  oracleType: string
  oracleScaleFactor: number
  expirationTimestamp: number
  settlementTimestamp: number
  quoteDenom: string
  quoteToken: TokenMeta | undefined
  makerFeeRate: string
  takerFeeRate: string
  serviceProviderFee: string
  minPriceTickSize: string
  minQuantityTickSize: string
  settlementPrice: string
}

export interface BinaryOptionsLimitOrder {
  orderHash: string
  orderSide: BinaryOptionsOrderSide
  marketId: string
  subaccountId: string
  isReduceOnly: boolean
  margin: string
  price: string
  quantity: string
  unfilledQuantity: string
  triggerPrice: string
  feeRecipient: string
  state: BinaryOptionsOrderState
}

export interface BinaryOptionsTrade extends PositionDelta {
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

export interface BinaryOptionsLimitOrderParams {
  orderType: GrpcOrderType
  triggerPrice?: string
  feeRecipient: string
  price: string
  margin: string
  quantity: string
}

export interface BinaryOptionsOrderCancelParams {
  orderHash: string
}

export interface BatchBinaryOptionsOrderCancelParams {
  marketId: string
  subaccountId: string
  orderHash: string
}

export {
  GrpcBinaryOptionsPosition,
  GrpcBinaryOptionsMarketInfo,
  GrpcBinaryOptionsLimitOrder,
  GrpcBinaryOptionsTrade,
}
