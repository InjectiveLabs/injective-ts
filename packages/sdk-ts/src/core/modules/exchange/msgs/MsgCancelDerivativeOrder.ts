import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgCancelDerivativeOrder as BaseMsgCancelDerivativeOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { OrderMask } from '../../../../types/exchange'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelDerivativeOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMaskMap[keyof OrderMaskMap]
  }

  export type Proto = BaseMsgCancelDerivativeOrder

  export type Object = BaseMsgCancelDerivativeOrder.AsObject
}

export default class MsgCancelDerivativeOrder extends MsgBase<
  MsgCancelDerivativeOrder.Params,
  MsgCancelDerivativeOrder.Proto,
  MsgCancelDerivativeOrder.Object
> {
  static fromJSON(
    params: MsgCancelDerivativeOrder.Params,
  ): MsgCancelDerivativeOrder {
    return new MsgCancelDerivativeOrder(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgCancelDerivativeOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    // TODO: Send order.orderMask instead when chain handles order mask properly.
    message.setOrderMask(OrderMask.Any)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgCancelDerivativeOrder',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelDerivativeOrder',
      message: proto,
    }
  }
}
