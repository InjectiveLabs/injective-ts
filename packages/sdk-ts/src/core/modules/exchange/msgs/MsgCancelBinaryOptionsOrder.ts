import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgCancelBinaryOptionsOrder as BaseMsgCancelBinaryOptionsOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMask
  }

  export type Proto = BaseMsgCancelBinaryOptionsOrder
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

    const message = BaseMsgCancelBinaryOptionsOrder.create()
    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.orderHash = params.orderHash
    message.subaccountId = params.subaccountId

    // TODO: Send order.orderMask instead when chain handles order mask properly.
    message.orderMask = OrderMask.ANY

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
    return BaseMsgCancelBinaryOptionsOrder.encode(this.toProto()).finish()
  }
}
