import {
  InsuranceFund,
  GrpcOrderType,
  GrpcOrderTypeMap,
} from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { TokenType, type Token } from '@injectivelabs/token-metadata'

export const orderSideToOrderType = (orderType: OrderSide): GrpcOrderType => {
  switch (orderType) {
    case OrderSide.Unspecified:
      return GrpcOrderTypeMap.UNSPECIFIED
    case OrderSide.Buy:
      return GrpcOrderTypeMap.BUY
    case OrderSide.Sell:
      return GrpcOrderTypeMap.SELL
    case OrderSide.StopBuy:
      return GrpcOrderTypeMap.STOP_BUY
    case OrderSide.StopSell:
      return GrpcOrderTypeMap.STOP_SELL
    case OrderSide.TakeBuy:
      return GrpcOrderTypeMap.TAKE_BUY
    case OrderSide.TakeSell:
      return GrpcOrderTypeMap.TAKE_SELL
    case OrderSide.BuyPO:
      return GrpcOrderTypeMap.BUY_PO
    case OrderSide.SellPO:
      return GrpcOrderTypeMap.SELL_PO
    case OrderSide.SellPO:
      return GrpcOrderTypeMap.BUY_ATOMIC
    case OrderSide.SellPO:
      return GrpcOrderTypeMap.SELL_ATOMIC
    case OrderSide.SellPO:
      return GrpcOrderTypeMap.UNRECOGNIZED
    default:
      return GrpcOrderTypeMap.BUY
  }
}

export const getTokenFromInsuranceFund = (
  denom: string,
  response: InsuranceFund,
): Token => {
  return {
    denom,
    name: (response.marketTicker || 'Unknown') + 'Insurance Fund',
    symbol: denom || 'Unknown',
    decimals: 18,
    logo: 'injective-v3.svg',
    coinGeckoId: '',
    tokenType: TokenType.InsuranceFund,
  } as Token
}
