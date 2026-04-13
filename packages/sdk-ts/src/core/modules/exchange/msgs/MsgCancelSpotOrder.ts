import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelSpotOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgCancelSpotOrder
}

/**
 * @category Messages
 */
export default class MsgCancelSpotOrder extends MsgBase<
  MsgCancelSpotOrder.Params,
  MsgCancelSpotOrder.Proto
> {
  static fromJSON(params: MsgCancelSpotOrder.Params): MsgCancelSpotOrder {
    return new MsgCancelSpotOrder(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1TxPb.MsgCancelSpotOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash || '',
      cid: params.cid || '',
    })

    // TODO: message.setOrderMask does not exist yet, enable this once it does.

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
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
      cid: proto.cid,
    }

    return {
      type: 'exchange/MsgCancelSpotOrder',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgCancelSpotOrder.toBinary(
      this.toProto(),
    )
  }
}
