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

  export interface Amino extends BaseMsgBatchUpdateOrders.AsObject {
    type: 'exchange/MsgBatchUpdateOrders'
  }

  export interface Web3 extends BaseMsgBatchUpdateOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders'
  }

  export type Proto = BaseMsgBatchUpdateOrders
}

/**
 * @category Messages
 */
export default class MsgBatchUpdateOrders extends MsgBase<
  MsgBatchUpdateOrders.Params,
  MsgBatchUpdateOrders.Data,
  MsgBatchUpdateOrders.Proto,
  MsgBatchUpdateOrders.Amino,
  MsgBatchUpdateOrders.DirectSign
> {
  static fromJSON(params: MsgBatchUpdateOrders.Params): MsgBatchUpdateOrders {
    return new MsgBatchUpdateOrders(params)
  }

  public toProto(): MsgBatchUpdateOrders.Proto {
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

  public toData(): MsgBatchUpdateOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgBatchUpdateOrders.Amino {
    const proto = this.toProto()

    /*
    const web3Message = proto.toObject() as any

    delete web3Message.spotMarketIdsToCancelAllList
    delete web3Message.derivativeMarketIdsToCancelAllList
    delete web3Message.spotOrdersToCancelList
    delete web3Message.derivativeOrdersToCancelList
    delete web3Message.spotOrdersToCreateList
    delete web3Message.derivativeOrdersToCreateList
    // delete web3Message.subaccountId

    /*
    if (web3Message.derivativeMarketIdsToCancelAllList !== undefined) {
      web3Message.derivative_market_ids_to_cancel_all =
        web3Message.derivativeMarketIdsToCancelAllList

      delete web3Message.derivativeMarketIdsToCancelAllList
    }

    if (web3Message.spotMarketIdsToCancelAllList !== undefined) {
      web3Message.spot_market_ids_to_cancel_all =
        web3Message.spotMarketIdsToCancelAllList

      delete web3Message.spotMarketIdsToCancelAllList
    }

    if (web3Message.spotOrdersToCancelList !== undefined) {
      web3Message.spot_orders_to_cancel = web3Message.spotOrdersToCancelList

      delete web3Message.spotOrdersToCancelList
    }

    if (web3Message.derivativeOrdersToCancelList !== undefined) {
      web3Message.derivative_orders_to_cancel =
        web3Message.derivativeOrdersToCancelList

      delete web3Message.derivativeOrdersToCancelList
    }

    if (web3Message.spotOrdersToCreateList !== undefined) {
      web3Message.spot_orders_to_create = web3Message.spotOrdersToCreateList

      delete web3Message.spotOrdersToCreateList
    }

    if (web3Message.derivativeOrdersToCreateList !== undefined) {
      web3Message.derivative_orders_to_create =
        web3Message.derivativeOrdersToCreateList

      delete web3Message.derivativeOrdersToCreateList
    }

    if (!web3Message.subaccountId) {
      delete web3Message.subaccountId
    }*/

    return {
      type: 'exchange/MsgBatchUpdateOrders',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgBatchUpdateOrders.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...rest,
    } as unknown as MsgBatchUpdateOrders.Web3
  }

  public toDirectSign(): MsgBatchUpdateOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      message: proto,
    }
  }
}
