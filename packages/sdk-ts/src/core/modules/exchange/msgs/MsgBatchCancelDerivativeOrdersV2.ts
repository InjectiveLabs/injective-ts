import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelDerivativeOrdersV2 {
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

  export type Proto = InjectiveExchangeV2TxPb.MsgBatchCancelDerivativeOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelDerivativeOrdersV2 extends MsgBase<
  MsgBatchCancelDerivativeOrdersV2.Params,
  MsgBatchCancelDerivativeOrdersV2.Proto
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrdersV2.Params,
  ): MsgBatchCancelDerivativeOrdersV2 {
    return new MsgBatchCancelDerivativeOrdersV2(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = InjectiveExchangeV2TxPb.OrderData.create({
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash || '',
        orderMask:
          order.orderMask || InjectiveExchangeV2OrderPb.OrderMask.ANY,
        cid: order.cid || '',
      })

      return orderData
    })

    const message =
      InjectiveExchangeV2TxPb.MsgBatchCancelDerivativeOrders.create({
        sender: params.injectiveAddress,
        data: orderDataList,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelDerivativeOrders',
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
      type: 'exchange/MsgBatchCancelDerivativeOrders',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgBatchCancelDerivativeOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgBatchCancelDerivativeOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgBatchCancelDerivativeOrders.toBinary(
      this.toProto(),
    )
  }
}
