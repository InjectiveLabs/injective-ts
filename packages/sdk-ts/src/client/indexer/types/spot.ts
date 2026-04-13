import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import type { PriceLevel } from './exchange.js'
import type { GrpcOrderType } from '../../chain/types/exchange.js'
import type {
  OrderSide,
  TokenMeta,
  OrderState,
  TradeDirection,
  TradeExecutionType,
  TradeExecutionSide,
} from '../../../types/index.js'

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
  minNotional: number
}

export interface SpotLimitOrder {
  cid: string
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
  cid: string
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
  cid: string
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

export interface AtomicSwap {
  sender: string
  route: string
  sourceCoin: Coin | undefined
  destinationCoin: Coin | undefined
  fees: Coin[]
  contractAddress: string
  indexBySender: number
  indexBySenderContract: number
  txHash: string
  executedAt: number
}

export type GrpcSpotTrade = InjectiveSpotExchangeRpcPb.SpotTrade
export type GrpcSpotMarketInfo = InjectiveSpotExchangeRpcPb.SpotMarketInfo
export type GrpcSpotLimitOrder = InjectiveSpotExchangeRpcPb.SpotLimitOrder
export type GrpcSpotOrderHistory = InjectiveSpotExchangeRpcPb.SpotOrderHistory
export type GrpcAtomicSwap = InjectiveSpotExchangeRpcPb.AtomicSwap
