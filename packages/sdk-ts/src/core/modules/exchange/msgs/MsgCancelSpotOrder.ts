import { MsgCancelSpotOrder as BaseMsgCancelSpotOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelSpotOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
  }

  export type Proto = BaseMsgCancelSpotOrder
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

    const message = BaseMsgCancelSpotOrder.create()
    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.orderHash = params.orderHash
    message.subaccountId = params.subaccountId

    // TODO: message.setOrderMask does not exist yet, enable this once it does.

    return BaseMsgCancelSpotOrder.fromPartial(message)
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCancelSpotOrder',
      value: message,
    }
  }

  public toWeb3() {
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
    return BaseMsgCancelSpotOrder.encode(this.toProto()).finish()
  }
}
