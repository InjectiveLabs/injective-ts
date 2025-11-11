import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBatchCancelDerivativeOrders {
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
    InjectiveExchangeV1Beta1TxPb.MsgBatchCancelDerivativeOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrders.Params,
  MsgBatchCancelDerivativeOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrders.Params,
  ): MsgBatchCancelDerivativeOrders {
    return new MsgBatchCancelDerivativeOrders(params)
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
      InjectiveExchangeV1Beta1TxPb.MsgBatchCancelDerivativeOrders.create({
        sender: params.injectiveAddress,
        data: orderDataList,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
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
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgBatchCancelDerivativeOrders.toBinary(
      this.toProto(),
    )
  }
}
