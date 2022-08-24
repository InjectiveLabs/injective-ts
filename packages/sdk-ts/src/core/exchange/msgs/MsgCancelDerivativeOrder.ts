import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgCancelDerivativeOrder as BaseMsgCancelDerivativeOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { OrderMask } from '../../../types/exchange'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMaskMap[keyof OrderMaskMap]
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
    message: BaseMsgCancelDerivativeOrder
  }

  export interface Data extends BaseMsgCancelDerivativeOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder'
  }

  export interface Amino extends BaseMsgCancelDerivativeOrder.AsObject {
    type: 'exchange/MsgCancelDerivativeOrder'
  }

  export interface Web3 extends BaseMsgCancelDerivativeOrder.AsObject {
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

    const message = new BaseMsgCancelDerivativeOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)
    message.setOrderMask(
      params.orderMask !== undefined ? params.orderMask : OrderMask.Any,
    )

    return message
  }

  public toData(): MsgCancelDerivativeOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCancelDerivativeOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelDerivativeOrder',
      ...proto.toObject(),
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
}
