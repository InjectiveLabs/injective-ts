import {
  OrderSide,
  OrderState,
  TradeDirection,
  TradeExecutionType,
  TradeExecutionSide,
} from '@injectivelabs/ts-types'
import { GrpcOrderType } from '../../chain/types/exchange'
import { PriceLevel } from './exchange'
import { TokenMeta } from '@injectivelabs/token-metadata'
import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'

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
  orderSide: OrderSide
  marketId: string
  subaccountId: string
  price: string
  state: OrderState
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
  executionType: string
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
  tradeId: string
  executedAt: number
  tradeExecutionType: TradeExecutionType
  executionSide: TradeExecutionSide
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

export type GrpcSpotTrade = InjectiveSpotExchangeRpc.SpotTrade
export type GrpcSpotMarketInfo = InjectiveSpotExchangeRpc.SpotMarketInfo
export type GrpcSpotLimitOrder = InjectiveSpotExchangeRpc.SpotLimitOrder
export type GrpcSpotOrderHistory = InjectiveSpotExchangeRpc.SpotOrderHistory
