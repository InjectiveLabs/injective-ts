import { MsgCancelBinaryOptionsOrder as BaseMsgCancelBinaryOptionsOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
    message: BaseMsgCancelBinaryOptionsOrder
  }

  export interface Data extends BaseMsgCancelBinaryOptionsOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export interface Amino extends BaseMsgCancelBinaryOptionsOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export type Proto = BaseMsgCancelBinaryOptionsOrder
}

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

  toProto(): MsgCancelBinaryOptionsOrder.Proto {
    const { params } = this

    const message = new BaseMsgCancelBinaryOptionsOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    return message
  }

  toData(): MsgCancelBinaryOptionsOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgCancelBinaryOptionsOrder.Amino {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgCancelBinaryOptionsOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      message: proto,
    }
  }
}
