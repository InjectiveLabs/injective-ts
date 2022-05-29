import {
  MsgBatchUpdateOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'

export class MarketProtoComposer {
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
      message,
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
      message,
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
      message,
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
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
      message,
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
    }
  }
}
