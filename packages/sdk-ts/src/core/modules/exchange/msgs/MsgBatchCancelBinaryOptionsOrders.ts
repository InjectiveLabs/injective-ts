import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelBinaryOptionsOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash?: string
      orderMask?: InjectiveExchangeV1Beta1ExchangePb.OrderMask
      cid?: string
    }[]
  }

  export type Proto =
    InjectiveExchangeV1Beta1TxPb.MsgBatchCancelBinaryOptionsOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelBinaryOptionsOrders extends MsgBase<
  MsgBatchCancelBinaryOptionsOrders.Params,
  MsgBatchCancelBinaryOptionsOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelBinaryOptionsOrders.Params,
  ): MsgBatchCancelBinaryOptionsOrders {
    return new MsgBatchCancelBinaryOptionsOrders(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      return InjectiveExchangeV1Beta1TxPb.OrderData.create({
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash || '',
        orderMask: InjectiveExchangeV1Beta1ExchangePb.OrderMask.ANY,
        cid: order.cid || '',
      })
    })

    const message =
      InjectiveExchangeV1Beta1TxPb.MsgBatchCancelBinaryOptionsOrders.create({
        sender: params.injectiveAddress,
        data: orderDataList,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
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
        order_mask: order.orderMask,
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
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgBatchCancelBinaryOptionsOrders.toBinary(
      this.toProto(),
    )
  }
}
