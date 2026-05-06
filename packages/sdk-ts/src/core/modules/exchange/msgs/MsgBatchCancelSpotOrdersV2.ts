import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelSpotOrdersV2 {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash?: string
      orderMask?: InjectiveExchangeV2OrderPb.OrderMask
      cid?: string
    }[]
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgBatchCancelSpotOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrdersV2 extends MsgBase<
  MsgBatchCancelSpotOrdersV2.Params,
  MsgBatchCancelSpotOrdersV2.Proto
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrdersV2.Params,
  ): MsgBatchCancelSpotOrdersV2 {
    return new MsgBatchCancelSpotOrdersV2(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = InjectiveExchangeV2TxPb.OrderData.create({
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash || '',
        orderMask: order.orderMask || InjectiveExchangeV2OrderPb.OrderMask.ANY,
        cid: order.cid || '',
      })

      return orderData
    })

    const message = InjectiveExchangeV2TxPb.MsgBatchCancelSpotOrders.create({
      sender: params.injectiveAddress,
      data: orderDataList,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelSpotOrders',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      data: proto.data.map((orderData) => ({
        market_id: orderData.marketId,
        subaccount_id: orderData.subaccountId,
        order_hash: orderData.orderHash,
        order_mask: orderData.orderMask,
        cid: orderData.cid,
      })),
    }

    return {
      type: 'exchange/MsgBatchCancelSpotOrders',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelSpotOrders',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { value, type } = amino
    const { params } = this

    return {
      type,
      value: {
        ...value,
        data: (value.data as any[]).map((order, i) => {
          const { order_mask, ...rest } = order
          return params.orders[i].orderMask !== undefined
            ? { ...rest, order_mask }
            : rest
        }),
      },
    }
  }

  public toEip712V2() {
    // V2 always includes order_mask for every order (unlike toEip712 v1 which omits it when not explicitly set by the caller)
    return this.toWeb3Gw()
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgBatchCancelSpotOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgBatchCancelSpotOrders.toBinary(
      this.toProto(),
    )
  }
}
