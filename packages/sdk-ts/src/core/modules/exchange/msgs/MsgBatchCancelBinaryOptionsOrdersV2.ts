import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelBinaryOptionsOrdersV2 {
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

  export type Proto = InjectiveExchangeV2TxPb.MsgBatchCancelBinaryOptionsOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelBinaryOptionsOrdersV2 extends MsgBase<
  MsgBatchCancelBinaryOptionsOrdersV2.Params,
  MsgBatchCancelBinaryOptionsOrdersV2.Proto
> {
  static fromJSON(
    params: MsgBatchCancelBinaryOptionsOrdersV2.Params,
  ): MsgBatchCancelBinaryOptionsOrdersV2 {
    return new MsgBatchCancelBinaryOptionsOrdersV2(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      return InjectiveExchangeV2TxPb.OrderData.create({
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash || '',
        orderMask: order.orderMask || InjectiveExchangeV2OrderPb.OrderMask.ANY,
        cid: order.cid || '',
      })
    })

    const message =
      InjectiveExchangeV2TxPb.MsgBatchCancelBinaryOptionsOrders.create({
        sender: params.injectiveAddress,
        data: orderDataList,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelBinaryOptionsOrders',
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
      type: 'exchange/MsgBatchCancelBinaryOptionsOrders',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelBinaryOptionsOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgBatchCancelBinaryOptionsOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgBatchCancelBinaryOptionsOrders.toBinary(
      this.toProto(),
    )
  }
}
