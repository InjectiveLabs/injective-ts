import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgCancelSpotOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash?: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCancelSpotOrder
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

    const message = InjectiveExchangeV1Beta1Tx.MsgCancelSpotOrder.create()

    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.subaccountId = params.subaccountId

    if (params.orderHash) {
      message.orderHash = params.orderHash
    }

    if (params.cid) {
      message.cid = params.cid
    }

    // TODO: message.setOrderMask does not exist yet, enable this once it does.

    return InjectiveExchangeV1Beta1Tx.MsgCancelSpotOrder.fromPartial(message)
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
    return InjectiveExchangeV1Beta1Tx.MsgCancelSpotOrder.encode(
      this.toProto(),
    ).finish()
  }
}
