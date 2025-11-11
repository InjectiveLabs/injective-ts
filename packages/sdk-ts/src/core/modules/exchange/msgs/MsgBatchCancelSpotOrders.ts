import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelSpotOrders {
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

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgBatchCancelSpotOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrders.Params,
  MsgBatchCancelSpotOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrders.Params,
  ): MsgBatchCancelSpotOrders {
    return new MsgBatchCancelSpotOrders(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = InjectiveExchangeV1Beta1TxPb.OrderData.create({
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash || '',
        orderMask:
          order.orderMask || InjectiveExchangeV1Beta1ExchangePb.OrderMask.ANY,
        cid: order.cid || '',
      })

      return orderData
    })

    const message =
      InjectiveExchangeV1Beta1TxPb.MsgBatchCancelSpotOrders.create({
        sender: params.injectiveAddress,
        data: orderDataList,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
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
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgBatchCancelSpotOrders.toBinary(
      this.toProto(),
    )
  }
}
