import {
  SpotMarketInfo as GrpcSpotMarketInfo,
  SpotLimitOrder as GrpcSpotLimitOrder,
  SpotTrade as GrpcSpotTrade,
  SpotOrderHistory as GrpcSpotOrderHistory,
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
import { TradeExecutionType, TradeDirection } from '@injectivelabs/ts-types'
import { GrpcOrderType } from '../../chain/types/exchange'
import { PriceLevel } from './exchange'
import { TokenMeta } from '@injectivelabs/token-metadata'

export enum SpotOrderSide {
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

export enum SpotOrderState {
  Unfilled = 'unfilled',
  Booked = 'booked',
  PartialFilled = 'partial_filled',
  PartiallyFilled = 'partially_filled',
  Filled = 'filled',
  Canceled = 'canceled',
  Triggered = 'triggered'
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
  createdAt: number
  updatedAt: number
}

export interface SpotOrderHistory {
  orderHash: string
  marketId: string
  active: boolean
  subaccountId: string
  executionType: string,
  orderType: string
  price: string
  triggerPrice: string
  quantity: string
  filledQuantity: string
  state: string
  createdAt: number
  updatedAt: number
  direction: string
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

export interface SpotLimitOrderParams {
  orderType: GrpcOrderType
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
  GrpcSpotMarketInfo,
  GrpcSpotLimitOrder,
  GrpcSpotOrderHistory,
  GrpcSpotTrade,
}
