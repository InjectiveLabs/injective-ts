import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgCancelDerivativeOrder as BaseMsgCancelDerivativeOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMask
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
    message: BaseMsgCancelDerivativeOrder
  }

  export interface Data extends BaseMsgCancelDerivativeOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
  }

  export interface Amino extends BaseMsgCancelDerivativeOrder {
    type: 'exchange/MsgCancelDerivativeOrder'
  }

  export interface Web3 extends BaseMsgCancelDerivativeOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
  }

  export type Proto = BaseMsgCancelDerivativeOrder
}

export default class MsgCancelDerivativeOrder extends MsgBase<
  MsgCancelDerivativeOrder.Params,
  MsgCancelDerivativeOrder.Data,
  MsgCancelDerivativeOrder.Proto,
  MsgCancelDerivativeOrder.Amino,
  MsgCancelDerivativeOrder.DirectSign
> {
  static fromJSON(
    params: MsgCancelDerivativeOrder.Params,
  ): MsgCancelDerivativeOrder {
    return new MsgCancelDerivativeOrder(params)
  }

  public toProto(): MsgCancelDerivativeOrder.Proto {
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

  public toData(): MsgCancelDerivativeOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCancelDerivativeOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelDerivativeOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCancelDerivativeOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...rest,
    } as unknown as MsgCancelDerivativeOrder.Web3
  }

  public toDirectSign(): MsgCancelDerivativeOrder.DirectSign {
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
