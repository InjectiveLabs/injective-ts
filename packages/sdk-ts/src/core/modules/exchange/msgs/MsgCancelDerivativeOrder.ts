import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgCancelDerivativeOrder as BaseMsgCancelDerivativeOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMask
  }

  export type Proto = BaseMsgCancelDerivativeOrder
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

    const message = BaseMsgCancelDerivativeOrder.create()
    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.orderHash = params.orderHash
    message.subaccountId = params.subaccountId

    // TODO: Send order.orderMask instead when chain handles order mask properly.
    message.orderMask = OrderMask.ANY

    return BaseMsgCancelDerivativeOrder.fromPartial(message)
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
    return BaseMsgCancelDerivativeOrder.encode(this.toProto()).finish()
  }
}
