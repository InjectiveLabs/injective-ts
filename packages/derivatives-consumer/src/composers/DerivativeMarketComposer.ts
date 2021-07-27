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
import snakeCaseKeys from 'snakecase-keys'
import {
  DerivativeLimitOrderParams,
  BatchDerivativeOrderCancelParams,
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
    derivativeOrder.setMargin(order.margin)

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
    derivativeOrder.setMargin(order.margin)

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

      return { ...snakeCaseKeys(orderData.toObject()) }
    })

    const content = new MsgBatchCancelDerivativeOrders()
    content.setSender(injectiveAddress)

    return {
      sender: injectiveAddress,
      data: [...orderDataList],
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
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
    const content = new MsgIncreasePositionMargin()
    content.setSender(injectiveAddress)
    content.setAmount(amount)
    content.setMarketId(marketId)
    content.setSourceSubaccountId(srcSubaccountId)
    content.setDestinationSubaccountId(dstSubaccountId)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
    }
  }
}
