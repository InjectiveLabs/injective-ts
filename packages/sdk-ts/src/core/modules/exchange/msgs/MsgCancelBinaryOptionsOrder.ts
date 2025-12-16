import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV1Beta1ExchangePb.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgCancelBinaryOptionsOrder
}

/**
 * @category Messages
 */
export default class MsgCancelBinaryOptionsOrder extends MsgBase<
  MsgCancelBinaryOptionsOrder.Params,
  MsgCancelBinaryOptionsOrder.Proto
> {
  static fromJSON(
    params: MsgCancelBinaryOptionsOrder.Params,
  ): MsgCancelBinaryOptionsOrder {
    return new MsgCancelBinaryOptionsOrder(params)
  }

  public toProto() {
    const { params } = this

    const message =
      InjectiveExchangeV1Beta1TxPb.MsgCancelBinaryOptionsOrder.create({
        sender: params.injectiveAddress,
        marketId: params.marketId,
        subaccountId: params.subaccountId,
        orderHash: params.orderHash || '',
        orderMask: InjectiveExchangeV1Beta1ExchangePb.OrderMask.ANY,
        cid: params.cid || '',
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
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
      type: 'exchange/MsgCancelBinaryOptionsOrder',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgCancelBinaryOptionsOrder.toBinary(
      this.toProto(),
    )
  }
}
