import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV1Beta1ExchangePb.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgCancelDerivativeOrder
}

export default class MsgCancelDerivativeOrder extends MsgBase<
  MsgCancelDerivativeOrder.Params,
  MsgCancelDerivativeOrder.Proto
> {
  static fromJSON(
    params: MsgCancelDerivativeOrder.Params,
  ): MsgCancelDerivativeOrder {
    return new MsgCancelDerivativeOrder(params)
  }

  public toProto() {
    const { params } = this

    const message =
      InjectiveExchangeV1Beta1TxPb.MsgCancelDerivativeOrder.create({
        sender: params.injectiveAddress,
        marketId: params.marketId,
        subaccountId: params.subaccountId,
        orderHash: params.orderHash || '',
        orderMask:
          params.orderMask || InjectiveExchangeV1Beta1ExchangePb.OrderMask.ANY,
        cid: params.cid || '',
      })

    // TODO: Send order.orderMask instead when chain handles order mask properly.

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      market_id: proto.marketId,
      subaccount_id: proto.subaccountId,
      order_hash: proto.orderHash,
      order_mask: proto.orderMask,
      cid: proto.cid,
    }

    return {
      type: 'exchange/MsgCancelDerivativeOrder',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgCancelDerivativeOrder.toBinary(
      this.toProto(),
    )
  }
}
