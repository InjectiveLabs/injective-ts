import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCancelBinaryOptionsOrder
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
      InjectiveExchangeV1Beta1Tx.MsgCancelBinaryOptionsOrder.create()

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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCancelBinaryOptionsOrder',
      value: message,
    }
  }

  public toWeb3() {
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
    return InjectiveExchangeV1Beta1Tx.MsgCancelBinaryOptionsOrder.encode(
      this.toProto(),
    ).finish()
  }
}
