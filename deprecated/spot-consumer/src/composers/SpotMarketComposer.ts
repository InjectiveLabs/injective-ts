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
import snakeCaseKeys from 'snakecase-keys'
import {
  amountToCosmosSdkDecAmount,
  getWeb3GatewayMessage,
} from '@injectivelabs/utils'
import { ComposerResponse } from '@injectivelabs/ts-types'
import {
  BatchSpotOrderCancelParams,
  SpotLimitOrderParams,
  SpotOrderCancelParams,
} from '../types'

/**
 * Note:
 * We have to convert some numbers that
 * are represented as strings to sdk.Dec types
 * so we can broadcast them directly to the chain
 */
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
  }): ComposerResponse<
    MsgCreateSpotLimitOrder,
    MsgCreateSpotLimitOrder.AsObject
  > {
    const createLimitOrder = ({
      price,
      quantity,
      triggerPrice,
    }: {
      price: string
      quantity: string
      triggerPrice?: string
    }) => {
      const orderInfo = new OrderInfo()
      orderInfo.setSubaccountId(subaccountId)
      orderInfo.setFeeRecipient(order.feeRecipient)
      orderInfo.setPrice(price)
      orderInfo.setQuantity(quantity)

      const spotOrder = new SpotOrder()
      spotOrder.setMarketId(marketId)
      spotOrder.setOrderType(order.orderType)
      spotOrder.setOrderInfo(orderInfo)

      if (triggerPrice) {
        spotOrder.setTriggerPrice(triggerPrice)
      }

      const message = new MsgCreateSpotLimitOrder()
      message.setSender(injectiveAddress)
      message.setOrder(spotOrder)

      return message
    }

    const type = '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
    const web3GatewayMessage = createLimitOrder({
      price: order.price,
      triggerPrice: order.triggerPrice,
      quantity: order.quantity,
    })
    const directBroadcastMessage = createLimitOrder({
      price: amountToCosmosSdkDecAmount(order.price).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        order.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(order.quantity).toFixed(),
    })

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        web3GatewayMessage.toObject(),
        type,
      ),
      directBroadcastMessage: { message: directBroadcastMessage, type },
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
  }): ComposerResponse<
    MsgCreateSpotMarketOrder,
    MsgCreateSpotMarketOrder.AsObject
  > {
    const createMarketOrder = ({
      price,
      quantity,
      triggerPrice,
    }: {
      price: string
      quantity: string
      triggerPrice?: string
    }) => {
      const orderInfo = new OrderInfo()
      orderInfo.setSubaccountId(subaccountId)
      orderInfo.setFeeRecipient(order.feeRecipient)
      orderInfo.setPrice(price)
      orderInfo.setQuantity(quantity)

      const spotOrder = new SpotOrder()
      spotOrder.setMarketId(marketId)
      spotOrder.setOrderType(order.orderType)
      spotOrder.setOrderInfo(orderInfo)

      if (triggerPrice) {
        spotOrder.setTriggerPrice(triggerPrice)
      }

      const message = new MsgCreateSpotMarketOrder()
      message.setSender(injectiveAddress)
      message.setOrder(spotOrder)

      return message
    }

    const type = '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
    const web3GatewayMessage = createMarketOrder({
      price: order.price,
      triggerPrice: order.triggerPrice,
      quantity: order.quantity,
    })

    const directBroadcastMessage = createMarketOrder({
      price: amountToCosmosSdkDecAmount(order.price).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        order.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(order.quantity).toFixed(),
    })

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        web3GatewayMessage.toObject(),
        type,
      ),
      directBroadcastMessage: { message: directBroadcastMessage, type },
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
  }): ComposerResponse<MsgCancelSpotOrder, MsgCancelSpotOrder.AsObject> {
    const message = new MsgCancelSpotOrder()
    message.setSender(injectiveAddress)
    message.setMarketId(marketId)
    message.setOrderHash(order.orderHash)
    message.setSubaccountId(subaccountId)

    const type = '/injective.exchange.v1beta1.MsgCancelSpotOrder'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: { message, type },
    }
  }

  static batchCancelSpotOrder({
    injectiveAddress,
    orders,
  }: {
    injectiveAddress: string
    orders: BatchSpotOrderCancelParams[]
  }): ComposerResponse<
    MsgBatchCancelSpotOrders,
    MsgBatchCancelSpotOrders.AsObject
  > {
    const orderDataList = orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return {
        web3GatewayMessageOrderDataList: snakeCaseKeys(orderData.toObject()),
        directBroadcastMessageOrderDataList: orderData,
      }
    })

    const message = new MsgBatchCancelSpotOrders()
    message.setSender(injectiveAddress)
    message.setDataList(
      orderDataList.map((o) => o.directBroadcastMessageOrderDataList),
    )

    const type = '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        {
          sender: injectiveAddress,
          data: [
            ...orderDataList.map((o) => o.web3GatewayMessageOrderDataList),
          ],
        } as unknown as MsgBatchCancelSpotOrders.AsObject,
        type,
      ),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
