import {
  MsgCreateSpotLimitOrder,
  MsgCancelSpotOrder,
  MsgCreateSpotMarketOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import snakeCaseKeys from 'snakecase-keys'
import { SpotLimitOrderParams, SpotOrderCancelParams } from '../types'

export class SpotMarketComposer {
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

    const content = new MsgCreateSpotLimitOrder()
    content.setSender(injectiveAddress)
    content.setOrder(spotOrder)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
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

    const content = new MsgCreateSpotMarketOrder()
    content.setSender(injectiveAddress)
    content.setOrder(spotOrder)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
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
    const content = new MsgCancelSpotOrder()
    content.setSender(injectiveAddress)
    content.setMarketId(marketId)
    content.setOrderHash(order.orderHash)
    content.setSubaccountId(subaccountId)

    return {
      ...snakeCaseKeys(content.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
    }
  }
}
