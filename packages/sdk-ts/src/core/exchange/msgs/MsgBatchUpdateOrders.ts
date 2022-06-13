import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap,
  SpotOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  MsgBatchUpdateOrders as BaseMsgBatchUpdateOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchUpdateOrders {
  export interface Params {
    subaccountId: string
    spotMarketIdsToCancelAll?: string[]
    derivativeMarketIdsToCancelAll?: string[]
    spotOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
    derivativeOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
    spotOrdersToCreate?: {
      orderType: OrderTypeMap[keyof OrderTypeMap]
      triggerPrice?: string
      marketId: string
      feeRecipient: string
      price: string
      quantity: string
    }[]
    derivativeOrdersToCreate?: {
      orderType: OrderTypeMap[keyof OrderTypeMap]
      triggerPrice?: string
      feeRecipient: string
      marketId: string
      price: string
      margin: string
      quantity: string
    }[]
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders'
    message: BaseMsgBatchUpdateOrders
  }

  export interface Data extends BaseMsgBatchUpdateOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders'
  }

  export interface Web3 extends BaseMsgBatchUpdateOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders'
  }

  export type Proto = BaseMsgBatchUpdateOrders
}

export default class MsgBatchUpdateOrders extends MsgBase<
  MsgBatchUpdateOrders.Params,
  MsgBatchUpdateOrders.Data,
  MsgBatchUpdateOrders.Proto,
  MsgBatchUpdateOrders.Web3,
  MsgBatchUpdateOrders.DirectSign
> {
  static fromJSON(params: MsgBatchUpdateOrders.Params): MsgBatchUpdateOrders {
    return new MsgBatchUpdateOrders(params)
  }

  toProto(): MsgBatchUpdateOrders.Proto {
    const { params } = this

    const message = new BaseMsgBatchUpdateOrders()
    message.setSender(params.injectiveAddress)

    if (
      params.spotMarketIdsToCancelAll &&
      params.spotMarketIdsToCancelAll.length > 0
    ) {
      message.setSpotMarketIdsToCancelAllList(params.spotMarketIdsToCancelAll)
      message.setSubaccountId(params.subaccountId)
    }

    if (
      params.derivativeMarketIdsToCancelAll &&
      params.derivativeMarketIdsToCancelAll.length > 0
    ) {
      message.setDerivativeMarketIdsToCancelAllList(
        params.derivativeMarketIdsToCancelAll,
      )
      message.setSubaccountId(params.subaccountId)
    }

    if (params.spotOrdersToCancel && params.spotOrdersToCancel.length > 0) {
      const orderDataList = params.spotOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash }) => {
          const orderData = new OrderData()
          orderData.setMarketId(marketId)
          orderData.setSubaccountId(subaccountId)
          orderData.setOrderHash(orderHash)

          return orderData
        },
      )

      message.setSpotOrdersToCancelList(orderDataList)
    }

    if (
      params.derivativeOrdersToCancel &&
      params.derivativeOrdersToCancel.length > 0
    ) {
      const orderDataList = params.derivativeOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash }) => {
          const orderData = new OrderData()
          orderData.setMarketId(marketId)
          orderData.setSubaccountId(subaccountId)
          orderData.setOrderHash(orderHash)

          return orderData
        },
      )

      message.setDerivativeOrdersToCancelList(orderDataList)
    }

    if (params.spotOrdersToCreate && params.spotOrdersToCreate.length > 0) {
      const orderDataList = params.spotOrdersToCreate.map(
        ({
          orderType,
          marketId,
          price,
          quantity,
          triggerPrice,
          feeRecipient,
        }) => {
          const orderInfo = new OrderInfo()
          orderInfo.setSubaccountId(params.subaccountId)
          orderInfo.setFeeRecipient(feeRecipient)
          orderInfo.setPrice(price)
          orderInfo.setQuantity(quantity)

          const order = new SpotOrder()
          order.setMarketId(marketId)
          order.setOrderType(orderType)
          order.setOrderInfo(orderInfo)

          if (triggerPrice) {
            order.setTriggerPrice(triggerPrice)
          }

          return order
        },
      )

      message.setSpotOrdersToCreateList(orderDataList)
    }

    if (
      params.derivativeOrdersToCreate &&
      params.derivativeOrdersToCreate.length > 0
    ) {
      const orderDataList = params.derivativeOrdersToCreate.map(
        ({
          orderType,
          marketId,
          price,
          quantity,
          margin,
          triggerPrice,
          feeRecipient,
        }) => {
          const orderInfo = new OrderInfo()
          orderInfo.setSubaccountId(params.subaccountId)
          orderInfo.setFeeRecipient(feeRecipient)
          orderInfo.setPrice(price)
          orderInfo.setQuantity(quantity)

          const order = new DerivativeOrder()
          order.setMarketId(marketId)
          order.setOrderType(orderType)
          order.setOrderInfo(orderInfo)
          order.setMargin(margin)

          if (triggerPrice) {
            order.setTriggerPrice(triggerPrice)
          }

          return order
        },
      )

      message.setDerivativeOrdersToCreateList(orderDataList)
    }

    return message
  }

  toData(): MsgBatchUpdateOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgBatchUpdateOrders.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgBatchUpdateOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      message: proto,
    }
  }
}
