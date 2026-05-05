import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelBinaryOptionsOrderV2 {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV2OrderPb.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgCancelBinaryOptionsOrder
}

/**
 * @category Messages
 */
export default class MsgCancelBinaryOptionsOrderV2 extends MsgBase<
  MsgCancelBinaryOptionsOrderV2.Params,
  MsgCancelBinaryOptionsOrderV2.Proto
> {
  static fromJSON(
    params: MsgCancelBinaryOptionsOrderV2.Params,
  ): MsgCancelBinaryOptionsOrderV2 {
    return new MsgCancelBinaryOptionsOrderV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgCancelBinaryOptionsOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash || '',
      orderMask: InjectiveExchangeV2OrderPb.OrderMask.ANY,
      cid: params.cid || '',
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCancelBinaryOptionsOrder',
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
      '@type': '/injective.exchange.v2.MsgCancelBinaryOptionsOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgCancelBinaryOptionsOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgCancelBinaryOptionsOrder.toBinary(
      this.toProto(),
    )
  }
}
