import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgCancelBinaryOptionsOrder as BaseMsgCancelBinaryOptionsOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { OrderMask } from '../../../../types/exchange'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMaskMap[keyof OrderMaskMap]
  }

  export type Proto = BaseMsgCancelBinaryOptionsOrder

  export type Object = BaseMsgCancelBinaryOptionsOrder.AsObject
}

/**
 * @category Messages
 */
export default class MsgCancelBinaryOptionsOrder extends MsgBase<
  MsgCancelBinaryOptionsOrder.Params,
  MsgCancelBinaryOptionsOrder.Proto,
  MsgCancelBinaryOptionsOrder.Object
> {
  static fromJSON(
    params: MsgCancelBinaryOptionsOrder.Params,
  ): MsgCancelBinaryOptionsOrder {
    return new MsgCancelBinaryOptionsOrder(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgCancelBinaryOptionsOrder()
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
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgCancelBinaryOptionsOrder',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      message: proto,
    }
  }
}
