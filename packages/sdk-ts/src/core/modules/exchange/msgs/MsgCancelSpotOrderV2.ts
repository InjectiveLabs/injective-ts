import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelSpotOrderV2 {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgCancelSpotOrder
}

/**
 * @category Messages
 * No toEip712/toEip712V2 override needed — spot cancel has no order_mask field, so base-class defaults (toAmino/toWeb3Gw) are correct.
 */
export default class MsgCancelSpotOrderV2 extends MsgBase<
  MsgCancelSpotOrderV2.Params,
  MsgCancelSpotOrderV2.Proto
> {
  static fromJSON(params: MsgCancelSpotOrderV2.Params): MsgCancelSpotOrderV2 {
    return new MsgCancelSpotOrderV2(params)
  }

  public toProto() {
    const { params } = this

    if (!params.orderHash && !params.cid) {
      throw new Error('either orderHash or cid must be provided')
    }

    const message = InjectiveExchangeV2TxPb.MsgCancelSpotOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash || '',
      cid: params.cid || '',
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCancelSpotOrder',
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
      '@type': '/injective.exchange.v2.MsgCancelSpotOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgCancelSpotOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgCancelSpotOrder.toBinary(this.toProto())
  }
}
