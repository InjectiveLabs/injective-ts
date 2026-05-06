import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelDerivativeOrderV2 {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV2OrderPb.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgCancelDerivativeOrder
}

/**
 * @category Messages
 */
export default class MsgCancelDerivativeOrderV2 extends MsgBase<
  MsgCancelDerivativeOrderV2.Params,
  MsgCancelDerivativeOrderV2.Proto
> {
  static fromJSON(
    params: MsgCancelDerivativeOrderV2.Params,
  ): MsgCancelDerivativeOrderV2 {
    return new MsgCancelDerivativeOrderV2(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV2TxPb.MsgCancelDerivativeOrder.create({
      sender: params.injectiveAddress,
      marketId: params.marketId,
      subaccountId: params.subaccountId,
      orderHash: params.orderHash || '',
      orderMask: params.orderMask || InjectiveExchangeV2OrderPb.OrderMask.ANY,
      cid: params.cid || '',
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCancelDerivativeOrder',
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
      '@type': '/injective.exchange.v2.MsgCancelDerivativeOrder',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino
    const { order_mask, ...rest } = value

    return {
      type,
      value:
        this.params.orderMask !== undefined ? { ...rest, order_mask } : rest,
    }
  }

  public toEip712V2() {
    return this.toWeb3Gw()
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgCancelDerivativeOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgCancelDerivativeOrder.toBinary(
      this.toProto(),
    )
  }
}
