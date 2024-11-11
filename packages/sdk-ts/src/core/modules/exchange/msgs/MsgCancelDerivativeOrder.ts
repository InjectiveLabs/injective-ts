import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCancelDerivativeOrder
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

    const message = InjectiveExchangeV1Beta1Tx.MsgCancelDerivativeOrder.create()

    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.subaccountId = params.subaccountId

    if (params.orderHash) {
      message.orderHash = params.orderHash
    }

    // TODO: Send order.orderMask instead when chain handles order mask properly.
    message.orderMask = InjectiveExchangeV1Beta1Exchange.OrderMask.ANY

    if (params.cid) {
      message.cid = params.cid
    }

    return InjectiveExchangeV1Beta1Tx.MsgCancelDerivativeOrder.fromPartial(
      message,
    )
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCancelDerivativeOrder',
      value: message,
    }
  }

  public toWeb3() {
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
    return InjectiveExchangeV1Beta1Tx.MsgCancelDerivativeOrder.encode(
      this.toProto(),
    ).finish()
  }
}
