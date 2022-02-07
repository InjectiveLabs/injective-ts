import { OrderData } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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
    const messageContent = {
      sender: injectiveAddress,
      subaccount_id: '',
    } as Record<string, any>

    if (spotMarketIdsToCancelAll && spotMarketIdsToCancelAll.length > 0) {
      messageContent.spot_market_ids_to_cancel_all = spotMarketIdsToCancelAll
      messageContent.subaccount_id = subaccountId
    } else {
      messageContent.spot_market_ids_to_cancel_all = []
    }

    if (
      derivativeMarketIdsToCancelAll &&
      derivativeMarketIdsToCancelAll.length > 0
    ) {
      messageContent.derivative_market_ids_to_cancel_all =
        derivativeMarketIdsToCancelAll
      messageContent.subaccount_id = subaccountId
    } else {
      messageContent.derivative_market_ids_to_cancel_all = []
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

      messageContent.spot_orders_to_cancel = orderDataList.map((order) =>
        order.toObject(),
      )
    } else {
      messageContent.spot_orders_to_cancel = []
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

      messageContent.derivative_orders_to_cancel = orderDataList.map((order) =>
        order.toObject(),
      )
    } else {
      messageContent.derivative_orders_to_cancel = []
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

      messageContent.spot_orders_to_create = orderDataList.map((order) =>
        order.toObject(),
      )
    } else {
      messageContent.spot_orders_to_create = []
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

      messageContent.derivative_orders_to_create = orderDataList.map((order) =>
        order.toObject(),
      )
    } else {
      messageContent.derivative_orders_to_create = []
    }

    return {
      ...snakeCaseKeys(messageContent),
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
    return {
      ...snakeCaseKeys({
        sender: injectiveAddress,
        subaccount_id: subaccountId,
        spot_market_ids_to_cancel_all: marketIds,
      }),
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
    return {
      ...snakeCaseKeys({
        sender: injectiveAddress,
        subaccount_id: subaccountId,
        derivative_market_ids_to_cancel_all: marketIds,
      }),
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

    return {
      ...snakeCaseKeys({
        sender: injectiveAddress,
        spot_orders_to_cancel: orderDataList.map((order) => order.toObject()),
      }),
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

    return {
      ...snakeCaseKeys({
        sender: injectiveAddress,
        derivative_orders_to_cancel: orderDataList.map((order) =>
          order.toObject(),
        ),
      }),
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
    }
  }
}
