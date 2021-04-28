import {
  MsgCreateDerivativeLimitOrder,
  MsgCancelDerivativeOrder,
  MsgCreateDerivativeMarketOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  DerivativeLimitOrderParams,
  DerivativeOrderCancelParams,
} from '../types'

export class DerivativeMarketComposer {
  static createLimitOrder({
    subaccountId,
    marketId,
    injectiveAddress,
    order,
  }: {
    subaccountId: string
    marketId: string
    injectiveAddress: string
    order: DerivativeLimitOrderParams
  }) {
    const orderInfo = new OrderInfo()
    orderInfo.setSubaccountId(subaccountId)
    orderInfo.setFeeRecipient(order.feeRecipient)
    orderInfo.setPrice(order.price)
    orderInfo.setQuantity(order.quantity)

    const derivativeOrder = new DerivativeOrder()
    derivativeOrder.setMarketId(marketId)
    derivativeOrder.setOrderType(order.orderType)
    derivativeOrder.setOrderInfo(orderInfo)

    if (order.triggerPrice) {
      derivativeOrder.setTriggerPrice(order.triggerPrice)
    }

    const content = new MsgCreateDerivativeLimitOrder()
    content.setSender(injectiveAddress)
    content.setOrder(derivativeOrder)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
    }
  }

  static createMarketOrder({
    subaccountId,
    marketId,
    injectiveAddress,
    order,
  }: {
    subaccountId: string
    injectiveAddress: string
    marketId: string
    order: DerivativeLimitOrderParams
  }) {
    const orderInfo = new OrderInfo()
    orderInfo.setSubaccountId(subaccountId)
    orderInfo.setFeeRecipient(order.feeRecipient)
    orderInfo.setPrice(order.price)
    orderInfo.setQuantity(order.quantity)

    const derivativeOrder = new DerivativeOrder()
    derivativeOrder.setMarketId(marketId)
    derivativeOrder.setOrderType(order.orderType)
    derivativeOrder.setOrderInfo(orderInfo)

    if (order.triggerPrice) {
      derivativeOrder.setTriggerPrice(order.triggerPrice)
    }

    const content = new MsgCreateDerivativeMarketOrder()
    content.setSender(injectiveAddress)
    content.setOrder(derivativeOrder)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
    }
  }

  static cancelDerivativeOrder({
    subaccountId,
    marketId,
    injectiveAddress,
    order,
  }: {
    subaccountId: string
    injectiveAddress: string
    marketId: string
    order: DerivativeOrderCancelParams
  }) {
    const content = new MsgCancelDerivativeOrder()
    content.setSender(injectiveAddress)
    content.setMarketId(marketId)
    content.setOrderHash(order.orderHash)
    content.setSubaccountId(subaccountId)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
    }
  }
}
