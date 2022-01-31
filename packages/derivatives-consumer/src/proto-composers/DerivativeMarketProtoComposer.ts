import {
  MsgCreateDerivativeLimitOrder,
  MsgCancelDerivativeOrder,
  MsgCreateDerivativeMarketOrder,
  MsgBatchCancelDerivativeOrders,
  OrderData,
  MsgIncreasePositionMargin,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  DerivativeLimitOrderParams,
  BatchDerivativeOrderCancelParams,
  DerivativeOrderCancelParams,
} from '../types'

export class DerivativeMarketProtoComposer {
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
    derivativeOrder.setMargin(order.margin)

    if (order.triggerPrice) {
      derivativeOrder.setTriggerPrice(order.triggerPrice)
    }

    const message = new MsgCreateDerivativeLimitOrder()
    message.setSender(injectiveAddress)
    message.setOrder(derivativeOrder)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
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
    derivativeOrder.setMargin(order.margin)

    if (order.triggerPrice) {
      derivativeOrder.setTriggerPrice(order.triggerPrice)
    }

    const message = new MsgCreateDerivativeMarketOrder()
    message.setSender(injectiveAddress)
    message.setOrder(derivativeOrder)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
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
    const message = new MsgCancelDerivativeOrder()
    message.setSender(injectiveAddress)
    message.setMarketId(marketId)
    message.setOrderHash(order.orderHash)
    message.setSubaccountId(subaccountId)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
    }
  }

  static batchCancelDerivativeOrder({
    injectiveAddress,
    orders,
  }: {
    injectiveAddress: string
    orders: BatchDerivativeOrderCancelParams[]
  }) {
    const orderDataList = orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return orderData
    })

    const message = new MsgBatchCancelDerivativeOrders()
    message.setSender(injectiveAddress)
    message.setDataList(orderDataList)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
    }
  }

  static addMarginToPosition({
    srcSubaccountId,
    dstSubaccountId,
    marketId,
    amount,
    injectiveAddress,
  }: {
    srcSubaccountId: string
    dstSubaccountId: string
    injectiveAddress: string
    marketId: string
    amount: string
  }) {
    const message = new MsgIncreasePositionMargin()
    message.setSender(injectiveAddress)
    message.setAmount(amount)
    message.setMarketId(marketId)
    message.setSourceSubaccountId(srcSubaccountId)
    message.setDestinationSubaccountId(dstSubaccountId)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
    }
  }
}
