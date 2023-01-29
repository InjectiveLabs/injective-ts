import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgCancelBinaryOptionsOrder as BaseMsgCancelBinaryOptionsOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMask
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
    message: BaseMsgCancelBinaryOptionsOrder
  }

  export interface Data extends BaseMsgCancelBinaryOptionsOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export interface Amino extends BaseMsgCancelBinaryOptionsOrder {
    type: 'exchange/MsgCancelBinaryOptionsOrder'
  }

  export interface Web3 extends BaseMsgCancelBinaryOptionsOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export type Proto = BaseMsgCancelBinaryOptionsOrder
}

/**
 * @category Messages
 */
export default class MsgCancelBinaryOptionsOrder extends MsgBase<
  MsgCancelBinaryOptionsOrder.Params,
  MsgCancelBinaryOptionsOrder.Data,
  MsgCancelBinaryOptionsOrder.Proto,
  MsgCancelBinaryOptionsOrder.Amino,
  MsgCancelBinaryOptionsOrder.DirectSign
> {
  static fromJSON(
    params: MsgCancelBinaryOptionsOrder.Params,
  ): MsgCancelBinaryOptionsOrder {
    return new MsgCancelBinaryOptionsOrder(params)
  }

  public toProto(): MsgCancelBinaryOptionsOrder.Proto {
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

  public toData(): MsgCancelBinaryOptionsOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCancelBinaryOptionsOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelBinaryOptionsOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCancelBinaryOptionsOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...rest,
    } as unknown as MsgCancelBinaryOptionsOrder.Web3
  }

  public toDirectSign(): MsgCancelBinaryOptionsOrder.DirectSign {
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
