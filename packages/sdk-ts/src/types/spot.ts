import { OrderTypeMap as GrpcOrderTypeMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'

export enum SpotOrderSide {
  Unspecified = 'unspecified',
  Buy = 'buy',
  Sell = 'sell',
  StopBuy = 'stop_buy',
  StopSell = 'stop_sell',
  TakeBuy = 'take_buy',
  TakeSell = 'take_sell',
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
