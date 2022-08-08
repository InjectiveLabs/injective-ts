import { MsgCancelSpotOrder as BaseMsgCancelSpotOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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

  export interface Data extends BaseMsgCancelSpotOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder'
  }

  export interface Amino extends BaseMsgCancelSpotOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder'
  }

  export type Proto = BaseMsgCancelSpotOrder
}

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

  toProto(): MsgCancelSpotOrder.Proto {
    const { params } = this

    const message = new BaseMsgCancelSpotOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    return message
  }

  toData(): MsgCancelSpotOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgCancelSpotOrder.Amino {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgCancelSpotOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      message: proto,
    }
  }
}
