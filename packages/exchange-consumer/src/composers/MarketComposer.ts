import {
  MsgBatchUpdateOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap as GrpcOrderTypeMap,
  SpotOrder,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'

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
  }) {
    const message = new MsgBatchUpdateOrders()
    message.setSubaccountId(subaccountId)
    message.setSender(injectiveAddress)

    if (spotMarketIdsToCancelAll && spotMarketIdsToCancelAll.length > 0) {
      message.setSpotMarketIdsToCancelAllList(spotMarketIdsToCancelAll)
    }

    if (
      derivativeMarketIdsToCancelAll &&
      derivativeMarketIdsToCancelAll.length > 0
    ) {
      message.setDerivativeMarketIdsToCancelAllList(
        derivativeMarketIdsToCancelAll,
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

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
  }) {
    const message = new MsgBatchUpdateOrders()
    message.setSubaccountId(subaccountId)
    message.setSpotMarketIdsToCancelAllList(marketIds)
    message.setSender(injectiveAddress)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
  }) {
    const message = new MsgBatchUpdateOrders()
    message.setSubaccountId(subaccountId)
    message.setDerivativeMarketIdsToCancelAllList(marketIds)
    message.setSender(injectiveAddress)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
  }) {
    const orderDataList = orders.map(
      ({ marketId, subaccountId, orderHash }) => {
        const orderData = new OrderData()
        orderData.setMarketId(marketId)
        orderData.setSubaccountId(subaccountId)
        orderData.setOrderHash(orderHash)

        return orderData
      },
    )

    const message = new MsgBatchUpdateOrders()
    message.setSpotOrdersToCancelList(orderDataList)
    message.setSender(injectiveAddress)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
  }) {
    const orderDataList = orders.map(
      ({ marketId, subaccountId, orderHash }) => {
        const orderData = new OrderData()
        orderData.setMarketId(marketId)
        orderData.setSubaccountId(subaccountId)
        orderData.setOrderHash(orderHash)

        return orderData
      },
    )

    const message = new MsgBatchUpdateOrders()
    message.setDerivativeOrdersToCancelList(orderDataList)
    message.setSender(injectiveAddress)

    return {
      ...snakeCaseKeys(message.toObject()),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
    }
  }
}
