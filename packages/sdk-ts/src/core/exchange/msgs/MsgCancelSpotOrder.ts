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
    type: 'exchange/MsgCancelSpotOrder'
  }

  export interface Web3 extends BaseMsgCancelSpotOrder.AsObject {
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

    const message = new BaseMsgCancelSpotOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    return message
  }

  public toData(): MsgCancelSpotOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCancelSpotOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelSpotOrder',
      ...proto.toObject(),
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
}
