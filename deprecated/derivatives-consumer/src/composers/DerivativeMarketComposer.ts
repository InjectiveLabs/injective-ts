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
  amountToCosmosSdkDecAmount,
  getWeb3GatewayMessage,
} from '@injectivelabs/utils'
import { ComposerResponse } from '@injectivelabs/ts-types'
import {
  DerivativeLimitOrderParams,
  BatchDerivativeOrderCancelParams,
  DerivativeOrderCancelParams,
} from '../types'

/**
 * Note:
 * We have to convert some numbers that
 * are represented as strings to sdk.Dec types
 * so we can broadcast them directly to the chain
 */
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
  }): ComposerResponse<
    MsgCreateDerivativeLimitOrder,
    MsgCreateDerivativeLimitOrder.AsObject
  > {
    const createLimitOrder = ({
      price,
      quantity,
      margin,
      triggerPrice,
    }: {
      price: string
      margin: string
      triggerPrice?: string
      quantity: string
    }) => {
      const orderInfo = new OrderInfo()
      orderInfo.setSubaccountId(subaccountId)
      orderInfo.setFeeRecipient(order.feeRecipient)
      orderInfo.setPrice(price)
      orderInfo.setQuantity(quantity)

      const derivativeOrder = new DerivativeOrder()
      derivativeOrder.setMarketId(marketId)
      derivativeOrder.setOrderType(order.orderType)
      derivativeOrder.setOrderInfo(orderInfo)
      derivativeOrder.setMargin(margin)

      if (triggerPrice) {
        derivativeOrder.setTriggerPrice(triggerPrice)
      }

      const message = new MsgCreateDerivativeLimitOrder()
      message.setSender(injectiveAddress)
      message.setOrder(derivativeOrder)

      return message
    }

    const type = '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
    const web3GatewayMessage = createLimitOrder({
      price: order.price,
      margin: order.margin,
      triggerPrice: order.triggerPrice,
      quantity: order.quantity,
    })
    const directBroadcastMessage = createLimitOrder({
      price: amountToCosmosSdkDecAmount(order.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(order.margin).toFixed(),
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
      directBroadcastMessage: {
        message: directBroadcastMessage,
        type,
      },
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
  }): ComposerResponse<
    MsgCreateDerivativeMarketOrder,
    MsgCreateDerivativeMarketOrder.AsObject
  > {
    const createMarketOrder = ({
      price,
      quantity,
      margin,
      triggerPrice,
    }: {
      price: string
      margin: string
      triggerPrice?: string
      quantity: string
    }) => {
      const orderInfo = new OrderInfo()
      orderInfo.setSubaccountId(subaccountId)
      orderInfo.setFeeRecipient(order.feeRecipient)
      orderInfo.setPrice(price)
      orderInfo.setQuantity(quantity)

      const derivativeOrder = new DerivativeOrder()
      derivativeOrder.setMarketId(marketId)
      derivativeOrder.setOrderType(order.orderType)
      derivativeOrder.setOrderInfo(orderInfo)
      derivativeOrder.setMargin(margin)

      if (triggerPrice) {
        derivativeOrder.setTriggerPrice(triggerPrice)
      }

      const message = new MsgCreateDerivativeMarketOrder()
      message.setSender(injectiveAddress)
      message.setOrder(derivativeOrder)

      return message
    }

    const type = '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder'
    const web3GatewayMessage = createMarketOrder({
      price: order.price,
      margin: order.margin,
      triggerPrice: order.triggerPrice,
      quantity: order.quantity,
    })
    const directBroadcastMessage = createMarketOrder({
      price: amountToCosmosSdkDecAmount(order.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(order.margin).toFixed(),
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
      directBroadcastMessage: {
        message: directBroadcastMessage,
        type,
      },
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
  }): ComposerResponse<
    MsgCancelDerivativeOrder,
    MsgCancelDerivativeOrder.AsObject
  > {
    const message = new MsgCancelDerivativeOrder()
    message.setSender(injectiveAddress)
    message.setMarketId(marketId)
    message.setOrderHash(order.orderHash)
    message.setSubaccountId(subaccountId)

    const type = '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: { message, type },
    }
  }

  static batchCancelDerivativeOrder({
    injectiveAddress,
    orders,
  }: {
    injectiveAddress: string
    orders: BatchDerivativeOrderCancelParams[]
  }): ComposerResponse<
    MsgBatchCancelDerivativeOrders,
    MsgBatchCancelDerivativeOrders.AsObject
  > {
    const orderDataList = orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return {
        web3GatewayOrderDataList: snakeCaseKeys(orderData.toObject()),
        directBroadcastOrderDataList: orderData,
      }
    })

    const message = new MsgBatchCancelDerivativeOrders()
    message.setSender(injectiveAddress)
    message.setDataList(
      orderDataList.map((o) => o.directBroadcastOrderDataList),
    )

    const type = '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        {
          sender: injectiveAddress,
          data: [...orderDataList.map((o) => o.web3GatewayOrderDataList)],
        } as unknown as MsgBatchCancelDerivativeOrders.AsObject,
        type,
      ),
      directBroadcastMessage: {
        message,
        type,
      },
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
  }): ComposerResponse<
    MsgIncreasePositionMargin,
    MsgIncreasePositionMargin.AsObject
  > {
    const addMarginToPosition = (amount: string) => {
      const message = new MsgIncreasePositionMargin()
      message.setSender(injectiveAddress)
      message.setAmount(amount)
      message.setMarketId(marketId)
      message.setSourceSubaccountId(srcSubaccountId)
      message.setDestinationSubaccountId(dstSubaccountId)

      return message
    }

    const type = '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
    const web3GatewayMessage = addMarginToPosition(amount)
    const directBroadcastMessage = addMarginToPosition(
      amountToCosmosSdkDecAmount(amount).toFixed(),
    )

    return {
      web3GatewayMessage: getWeb3GatewayMessage(
        web3GatewayMessage.toObject(),
        type,
      ),
      directBroadcastMessage: { message: directBroadcastMessage, type },
    }
  }
}
