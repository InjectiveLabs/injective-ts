import {
  MsgBatchUpdateOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap as GrpcOrderTypeMap,
  SpotOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import snakeCaseKeys from 'snakecase-keys'
import { ComposerResponse } from '@injectivelabs/ts-types'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

export class MarketComposer {
  static batchUpdateOrders({
    subaccountId,
    injectiveAddress,
    spotMarketIdsToCancelAll = [],
    derivativeMarketIdsToCancelAll = [],
    spotOrdersToCancel = [],
    derivativeOrdersToCancel = [],
    spotOrdersToCreate = [],
    derivativeOrdersToCreate = [],
  }: {
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
      orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap]
      triggerPrice?: string
      marketId: string
      feeRecipient: string
      price: string
      quantity: string
    }[]
    derivativeOrdersToCreate?: {
      orderType: GrpcOrderTypeMap[keyof GrpcOrderTypeMap]
      triggerPrice?: string
      feeRecipient: string
      marketId: string
      price: string
      margin: string
      quantity: string
    }[]
    injectiveAddress: string
  }): ComposerResponse<MsgBatchUpdateOrders, MsgBatchUpdateOrders.AsObject> {
    const message = new MsgBatchUpdateOrders()
    message.setSender(injectiveAddress)

    if (spotMarketIdsToCancelAll && spotMarketIdsToCancelAll.length > 0) {
      message.setSubaccountId(subaccountId)
      spotMarketIdsToCancelAll.forEach(message.addSpotMarketIdsToCancelAll)
    }

    if (
      derivativeMarketIdsToCancelAll &&
      derivativeMarketIdsToCancelAll.length > 0
    ) {
      message.setSubaccountId(subaccountId)
      derivativeMarketIdsToCancelAll.forEach(
        message.addDerivativeMarketIdsToCancelAll,
      )
    }

    if (spotOrdersToCancel && spotOrdersToCancel.length > 0) {
      const orderDataList = spotOrdersToCancel.map(
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

    if (derivativeOrdersToCancel && derivativeOrdersToCancel.length > 0) {
      const orderDataList = derivativeOrdersToCancel.map(
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

    if (spotOrdersToCreate && spotOrdersToCreate.length > 0) {
      const orderDataList = spotOrdersToCreate.map(
        ({
          orderType,
          marketId,
          price,
          quantity,
          triggerPrice,
          feeRecipient,
        }) => {
          const orderInfo = new OrderInfo()
          orderInfo.setSubaccountId(subaccountId)
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

    if (derivativeOrdersToCreate && derivativeOrdersToCreate.length > 0) {
      const orderDataList = derivativeOrdersToCreate.map(
        ({
          orderType,
          marketId,
          price,
          quantity,
          triggerPrice,
          margin,
          feeRecipient,
        }) => {
          const orderInfo = new OrderInfo()
          orderInfo.setSubaccountId(subaccountId)
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

    const type = '/injective.exchange.v1beta1.MsgBatchUpdateOrders'

    const messageKeysInSnakeCase = snakeCaseKeys(message.toObject())
    const messageKeysWithoutListSuffix = Object.entries(
      snakeCaseKeys(messageKeysInSnakeCase),
    ).reduce(
      (list, [key, value]) => ({ [key.replace('_list', '')]: value, ...list }),
      {},
    )

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        messageKeysWithoutListSuffix as unknown as MsgBatchUpdateOrders.AsObject,
        type,
      ),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static batchCancelAllSpotOrdersForMarketIds({
    subaccountId,
    marketIds,
    injectiveAddress,
  }: {
    subaccountId: string
    marketIds: string[]
    injectiveAddress: string
  }): ComposerResponse<any, any> {
    const messageContent = {
      sender: injectiveAddress,
      subaccount_id: subaccountId,
      spot_market_ids_to_cancel_all: marketIds,
    }
    const type = '/injective.exchange.v1beta1.MsgBatchUpdateOrders'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(messageContent, type),
      directBroadcastMessage: {
        type,
        message: messageContent,
      },
    }
  }

  static batchCancelAllDerivativeOrdersForMarketIds({
    subaccountId,
    marketIds,
    injectiveAddress,
  }: {
    subaccountId: string
    marketIds: string[]
    injectiveAddress: string
  }): ComposerResponse<any, any> {
    const messageContent = {
      sender: injectiveAddress,
      subaccount_id: subaccountId,
      derivative_market_ids_to_cancel_all: marketIds,
    }

    const type = '/injective.exchange.v1beta1.MsgBatchUpdateOrders'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(messageContent, type),
      directBroadcastMessage: {
        type,
        message: messageContent,
      },
    }
  }

  static batchCancelSpotOrders({
    orders,
    injectiveAddress,
  }: {
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
    injectiveAddress: string
  }): ComposerResponse<any, any> {
    const orderDataList = orders.map(
      ({ marketId, subaccountId, orderHash }) => {
        const orderData = new OrderData()
        orderData.setMarketId(marketId)
        orderData.setSubaccountId(subaccountId)
        orderData.setOrderHash(orderHash)

        return orderData
      },
    )

    const type = '/injective.exchange.v1beta1.MsgBatchUpdateOrders'

    const messageContent = {
      sender: injectiveAddress,
      spot_orders_to_cancel: orderDataList.map((order) => order.toObject()),
    }

    return {
      web3GatewayMessage: getWeb3GatewayMessage(messageContent, type),
      directBroadcastMessage: {
        type,
        message: messageContent,
      },
    }
  }

  static batchCancelDerivativeOrders({
    orders,
    injectiveAddress,
  }: {
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
    injectiveAddress: string
  }): ComposerResponse<any, any> {
    const orderDataList = orders.map(
      ({ marketId, subaccountId, orderHash }) => {
        const orderData = new OrderData()
        orderData.setMarketId(marketId)
        orderData.setSubaccountId(subaccountId)
        orderData.setOrderHash(orderHash)

        return orderData
      },
    )

    const type = '/injective.exchange.v1beta1.MsgBatchUpdateOrders'

    const messageContent = {
      sender: injectiveAddress,
      derivative_orders_to_cancel: orderDataList.map((order) =>
        order.toObject(),
      ),
    }

    return {
      web3GatewayMessage: getWeb3GatewayMessage(messageContent, type),
      directBroadcastMessage: {
        type,
        message: messageContent,
      },
    }
  }
}
