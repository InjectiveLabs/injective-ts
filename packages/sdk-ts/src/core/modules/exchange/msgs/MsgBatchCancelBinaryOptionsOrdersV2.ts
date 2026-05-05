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
        orderMask: InjectiveExchangeV2OrderPb.OrderMask.ANY,
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
    const { params } = this
    const message = {
      sender: params.injectiveAddress,
      data: params.orders.map((order) => ({
        market_id: order.marketId,
        subaccount_id: order.subaccountId,
        order_hash: order.orderHash,
        order_mask: order.orderMask ?? 0,
        cid: order.cid,
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

  public toEip712() {
    const amino = this.toAmino()
    const { value, type } = amino

    return {
      type,
      value: {
        ...value,
        data: (value.data as any[]).map((order) => {
          const { order_mask, ...rest } = order
          return order_mask ? { ...rest, order_mask } : rest
        }),
      },
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
