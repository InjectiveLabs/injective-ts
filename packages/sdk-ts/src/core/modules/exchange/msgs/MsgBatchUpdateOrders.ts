import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBatchUpdateOrders {
  export interface Params {
    subaccountId: string
    spotMarketIdsToCancelAll?: string[]
    derivativeMarketIdsToCancelAll?: string[]
    binaryOptionsMarketIdsToCancelAll?: string[]
    spotOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    derivativeOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    binaryOptionsOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    spotOrdersToCreate?: {
      orderType: InjectiveExchangeV1Beta1Exchange.OrderType
      triggerPrice?: string
      marketId: string
      feeRecipient: string
      price: string
      quantity: string
      cid?: string
    }[]
    derivativeOrdersToCreate?: {
      orderType: InjectiveExchangeV1Beta1Exchange.OrderType
      triggerPrice?: string
      feeRecipient: string
      marketId: string
      price: string
      margin: string
      quantity: string
      cid?: string
    }[]
    binaryOptionsOrdersToCreate?: {
      orderType: InjectiveExchangeV1Beta1Exchange.OrderType
      triggerPrice?: string
      feeRecipient: string
      marketId: string
      price: string
      margin: string
      quantity: string
      cid?: string
    }[]
    injectiveAddress: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgBatchUpdateOrders
}

/**
 * @category Messages
 */
export default class MsgBatchUpdateOrders extends MsgBase<
  MsgBatchUpdateOrders.Params,
  MsgBatchUpdateOrders.Proto
> {
  static fromJSON(params: MsgBatchUpdateOrders.Params): MsgBatchUpdateOrders {
    return new MsgBatchUpdateOrders(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1Tx.MsgBatchUpdateOrders.create()
    message.sender = params.injectiveAddress

    if (
      params.spotMarketIdsToCancelAll &&
      params.spotMarketIdsToCancelAll.length > 0
    ) {
      message.spotMarketIdsToCancelAll = params.spotMarketIdsToCancelAll
      message.subaccountId = params.subaccountId
    }

    if (
      params.derivativeMarketIdsToCancelAll &&
      params.derivativeMarketIdsToCancelAll.length > 0
    ) {
      message.derivativeMarketIdsToCancelAll =
        params.derivativeMarketIdsToCancelAll
      message.subaccountId = params.subaccountId
    }

    if (
      params.binaryOptionsMarketIdsToCancelAll &&
      params.binaryOptionsMarketIdsToCancelAll.length > 0
    ) {
      message.binaryOptionsMarketIdsToCancelAll =
        params.binaryOptionsMarketIdsToCancelAll
      message.subaccountId = params.subaccountId
    }

    if (params.spotOrdersToCancel && params.spotOrdersToCancel.length > 0) {
      const orderData = params.spotOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash, cid }) => {
          const orderData = InjectiveExchangeV1Beta1Tx.OrderData.create()
          orderData.marketId = marketId
          orderData.subaccountId = subaccountId

          if (orderHash) {
            orderData.orderHash = orderHash
          }

          if (cid) {
            orderData.cid = cid
          }

          return orderData
        },
      )

      message.spotOrdersToCancel = orderData
    }

    if (
      params.derivativeOrdersToCancel &&
      params.derivativeOrdersToCancel.length > 0
    ) {
      const orderData = params.derivativeOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash, cid }) => {
          const orderData = InjectiveExchangeV1Beta1Tx.OrderData.create()
          orderData.marketId = marketId
          orderData.subaccountId = subaccountId

          if (orderHash) {
            orderData.orderHash = orderHash
          }

          if (cid) {
            orderData.cid = cid
          }

          return orderData
        },
      )

      message.derivativeOrdersToCancel = orderData
    }
    if (
      params.binaryOptionsOrdersToCancel &&
      params.binaryOptionsOrdersToCancel.length > 0
    ) {
      const orderData = params.binaryOptionsOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash, cid }) => {
          const orderData = InjectiveExchangeV1Beta1Tx.OrderData.create()
          orderData.marketId = marketId
          orderData.subaccountId = subaccountId

          if (orderHash) {
            orderData.orderHash = orderHash
          }

          if (cid) {
            orderData.cid = cid
          }

          return orderData
        },
      )

      message.derivativeOrdersToCancel = orderData
    }

    if (params.spotOrdersToCreate && params.spotOrdersToCreate.length > 0) {
      const orderData = params.spotOrdersToCreate.map((args) => {
        const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
        const paramsFromArgs = {
          ...args,
          price: amountToCosmosSdkDecAmount(args.price).toFixed(),
          triggerPrice: amountToCosmosSdkDecAmount(
            args.triggerPrice || 0,
          ).toFixed(),
          quantity: amountToCosmosSdkDecAmount(args.quantity).toFixed(),
        }

        orderInfo.subaccountId = params.subaccountId
        orderInfo.feeRecipient = paramsFromArgs.feeRecipient
        orderInfo.price = paramsFromArgs.price
        orderInfo.quantity = paramsFromArgs.quantity

        if (paramsFromArgs.cid) {
          orderInfo.cid = paramsFromArgs.cid
        }

        const order = InjectiveExchangeV1Beta1Exchange.SpotOrder.create()
        order.marketId = paramsFromArgs.marketId
        order.orderType = paramsFromArgs.orderType
        order.orderInfo = orderInfo

        if (paramsFromArgs.triggerPrice) {
          order.triggerPrice = paramsFromArgs.triggerPrice
        }

        return order
      })

      message.spotOrdersToCreate = orderData
    }

    if (
      params.derivativeOrdersToCreate &&
      params.derivativeOrdersToCreate.length > 0
    ) {
      const orderData = params.derivativeOrdersToCreate.map((args) => {
        const paramsFromArgs = {
          ...args,
          price: amountToCosmosSdkDecAmount(args.price).toFixed(),
          margin: amountToCosmosSdkDecAmount(args.margin).toFixed(),
          triggerPrice: amountToCosmosSdkDecAmount(
            args.triggerPrice || 0,
          ).toFixed(),
          quantity: amountToCosmosSdkDecAmount(args.quantity).toFixed(),
        }

        const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
        orderInfo.subaccountId = params.subaccountId
        orderInfo.feeRecipient = paramsFromArgs.feeRecipient
        orderInfo.price = paramsFromArgs.price
        orderInfo.quantity = paramsFromArgs.quantity

        if (paramsFromArgs.cid) {
          orderInfo.cid = paramsFromArgs.cid
        }

        const order = InjectiveExchangeV1Beta1Exchange.DerivativeOrder.create()
        order.marketId = paramsFromArgs.marketId
        order.orderType = paramsFromArgs.orderType
        order.orderInfo = orderInfo
        order.margin = paramsFromArgs.margin

        if (paramsFromArgs.triggerPrice) {
          order.triggerPrice = paramsFromArgs.triggerPrice
        }

        return order
      })

      message.derivativeOrdersToCreate = orderData
    }
    if (
      params.binaryOptionsOrdersToCreate &&
      params.binaryOptionsOrdersToCreate.length > 0
    ) {
      const orderData = params.binaryOptionsOrdersToCreate.map((args) => {
        const paramsFromArgs = {
          ...args,
          price: amountToCosmosSdkDecAmount(args.price).toFixed(),
          margin: amountToCosmosSdkDecAmount(args.margin).toFixed(),
          triggerPrice: amountToCosmosSdkDecAmount(
            args.triggerPrice || 0,
          ).toFixed(),
          quantity: amountToCosmosSdkDecAmount(args.quantity).toFixed(),
        }
        const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
        orderInfo.subaccountId = params.subaccountId
        orderInfo.feeRecipient = paramsFromArgs.feeRecipient
        orderInfo.price = paramsFromArgs.price
        orderInfo.quantity = paramsFromArgs.quantity

        if (paramsFromArgs.cid) {
          orderInfo.cid = paramsFromArgs.cid
        }

        const order = InjectiveExchangeV1Beta1Exchange.DerivativeOrder.create()
        order.marketId = paramsFromArgs.marketId
        order.orderType = paramsFromArgs.orderType
        order.orderInfo = orderInfo
        order.margin = paramsFromArgs.margin

        if (paramsFromArgs.triggerPrice) {
          order.triggerPrice = paramsFromArgs.triggerPrice
        }

        return order
      })

      message.derivativeOrdersToCreate = orderData
    }

    return InjectiveExchangeV1Beta1Tx.MsgBatchUpdateOrders.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgBatchUpdateOrders',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgBatchUpdateOrders>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgBatchUpdateOrders.encode(
      this.toProto(),
    ).finish()
  }
}
