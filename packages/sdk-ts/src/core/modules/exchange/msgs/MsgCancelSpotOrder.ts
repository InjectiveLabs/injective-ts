// import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgCancelSpotOrder as BaseMsgCancelSpotOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
// import { OrderMask } from '../../../types/exchange'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgCancelSpotOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    // orderMask?: OrderMaskMap[keyof OrderMaskMap]
  }

  export type Proto = BaseMsgCancelSpotOrder

  export type Object = BaseMsgCancelSpotOrder.AsObject
}

/**
 * @category Messages
 */
export default class MsgCancelSpotOrder extends MsgBase<
  MsgCancelSpotOrder.Params,
  MsgCancelSpotOrder.Proto,
  MsgCancelSpotOrder.Object
> {
  static fromJSON(params: MsgCancelSpotOrder.Params): MsgCancelSpotOrder {
    return new MsgCancelSpotOrder(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgCancelSpotOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)

    // TODO: message.setOrderMask does not exist yet, enable this once it does.
    // message.setOrderMask(
    //   params.orderMask !== undefined ? params.orderMask : OrderMask.Any,
    // )

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelSpotOrder',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
