import { MsgCancelSpotOrder as BaseMsgCancelSpotOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelSpotOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelSpotOrder'
    message: BaseMsgCancelSpotOrder
  }

  export interface Data extends BaseMsgCancelSpotOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder'
  }

  export interface Amino extends BaseMsgCancelSpotOrder {
    type: 'exchange/MsgCancelSpotOrder'
  }

  export interface Web3 extends BaseMsgCancelSpotOrder {
    '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder'
  }

  export type Proto = BaseMsgCancelSpotOrder
}

/**
 * @category Messages
 */
export default class MsgCancelSpotOrder extends MsgBase<
  MsgCancelSpotOrder.Params,
  MsgCancelSpotOrder.Data,
  MsgCancelSpotOrder.Proto,
  MsgCancelSpotOrder.Amino,
  MsgCancelSpotOrder.DirectSign
> {
  static fromJSON(params: MsgCancelSpotOrder.Params): MsgCancelSpotOrder {
    return new MsgCancelSpotOrder(params)
  }

  public toProto(): MsgCancelSpotOrder.Proto {
    const { params } = this

    const message = BaseMsgCancelSpotOrder.create()
    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.orderHash = params.orderHash
    message.subaccountId = params.subaccountId

    // TODO: message.setOrderMask does not exist yet, enable this once it does.

    return BaseMsgCancelSpotOrder.fromPartial(message)
  }

  public toData(): MsgCancelSpotOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCancelSpotOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelSpotOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCancelSpotOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...rest,
    } as unknown as MsgCancelSpotOrder.Web3
  }

  public toDirectSign(): MsgCancelSpotOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCancelSpotOrder.encode(this.toProto()).finish()
  }
}
