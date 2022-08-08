import { MsgCancelDerivativeOrder as BaseMsgCancelDerivativeOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
    message: BaseMsgCancelDerivativeOrder
  }

  export interface Data extends BaseMsgCancelDerivativeOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
  }

  export interface Amino extends BaseMsgCancelDerivativeOrder.AsObject {
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

  toProto(): MsgCancelDerivativeOrder.Proto {
    const { params } = this

    const message = new BaseMsgCancelDerivativeOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    return message
  }

  toData(): MsgCancelDerivativeOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgCancelDerivativeOrder.Amino {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgCancelDerivativeOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      message: proto,
    }
  }
}
