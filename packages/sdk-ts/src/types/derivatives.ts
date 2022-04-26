import { OrderTypeMap as GrpcOrderTypeMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'

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
