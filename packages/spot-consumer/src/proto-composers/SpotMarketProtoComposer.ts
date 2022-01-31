import {
  MsgCreateSpotLimitOrder,
  MsgCancelSpotOrder,
  MsgCreateSpotMarketOrder,
  MsgBatchCancelSpotOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  BatchSpotOrderCancelParams,
  SpotLimitOrderParams,
  SpotOrderCancelParams,
} from '../types'

export class SpotMarketProtoComposer {
  static createLimitOrder({
    subaccountId,
    marketId,
    injectiveAddress,
    order,
  }: {
    subaccountId: string
    marketId: string
    injectiveAddress: string
    order: SpotLimitOrderParams
  }) {
    const orderInfo = new OrderInfo()
    orderInfo.setSubaccountId(subaccountId)
    orderInfo.setFeeRecipient(order.feeRecipient)
    orderInfo.setPrice(order.price)
    orderInfo.setQuantity(order.quantity)

    const spotOrder = new SpotOrder()
    spotOrder.setMarketId(marketId)
    spotOrder.setOrderType(order.orderType)
    spotOrder.setOrderInfo(orderInfo)

    if (order.triggerPrice) {
      spotOrder.setTriggerPrice(order.triggerPrice)
    }

    const message = new MsgCreateSpotLimitOrder()
    message.setSender(injectiveAddress)
    message.setOrder(spotOrder)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
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
    order: SpotLimitOrderParams
  }) {
    const orderInfo = new OrderInfo()
    orderInfo.setSubaccountId(subaccountId)
    orderInfo.setFeeRecipient(order.feeRecipient)
    orderInfo.setPrice(order.price)
    orderInfo.setQuantity(order.quantity)

    const spotOrder = new SpotOrder()
    spotOrder.setMarketId(marketId)
    spotOrder.setOrderType(order.orderType)
    spotOrder.setOrderInfo(orderInfo)

    if (order.triggerPrice) {
      spotOrder.setTriggerPrice(order.triggerPrice)
    }

    const message = new MsgCreateSpotMarketOrder()
    message.setSender(injectiveAddress)
    message.setOrder(spotOrder)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
    }
  }

  static cancelSpotOrder({
    subaccountId,
    marketId,
    injectiveAddress,
    order,
  }: {
    subaccountId: string
    injectiveAddress: string
    marketId: string
    order: SpotOrderCancelParams
  }) {
    const message = new MsgCancelSpotOrder()
    message.setSender(injectiveAddress)
    message.setMarketId(marketId)
    message.setOrderHash(order.orderHash)
    message.setSubaccountId(subaccountId)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgCancelSpotOrder',
    }
  }

  static batchCancelSpotOrder({
    injectiveAddress,
    orders,
  }: {
    injectiveAddress: string
    orders: BatchSpotOrderCancelParams[]
  }) {
    const orderDataList = orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return orderData
    })

    const message = new MsgBatchCancelSpotOrders()
    message.setSender(injectiveAddress)
    message.setDataList(orderDataList)

    return {
      message,
      type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
    }
  }
}
