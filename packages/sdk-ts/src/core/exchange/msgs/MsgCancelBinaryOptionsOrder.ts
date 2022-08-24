import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgCancelBinaryOptionsOrder as BaseMsgCancelBinaryOptionsOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { OrderMask } from '../../../types/exchange'

export declare namespace MsgCancelBinaryOptionsOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderHash: string
    orderMask?: OrderMaskMap[keyof OrderMaskMap]
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
    message: BaseMsgCancelBinaryOptionsOrder
  }

  export interface Data extends BaseMsgCancelBinaryOptionsOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export interface Amino extends BaseMsgCancelBinaryOptionsOrder.AsObject {
    type: 'exchange/MsgCancelBinaryOptionsOrder'
  }

  export interface Web3 extends BaseMsgCancelBinaryOptionsOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder'
  }

  export type Proto = BaseMsgCancelBinaryOptionsOrder
}

/**
 * @category Messages
 */
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

  public toProto(): MsgCancelBinaryOptionsOrder.Proto {
    const { params } = this

    const message = new BaseMsgCancelBinaryOptionsOrder()
    message.setSender(params.injectiveAddress)
    message.setMarketId(params.marketId)
    message.setOrderHash(params.orderHash)
    message.setSubaccountId(params.subaccountId)
    message.setOrderMask(
      params.orderMask !== undefined ? params.orderMask : OrderMask.Any,
    )

    return message
  }

  public toData(): MsgCancelBinaryOptionsOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCancelBinaryOptionsOrder.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgCancelBinaryOptionsOrder',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgCancelBinaryOptionsOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      ...rest,
    } as unknown as MsgCancelBinaryOptionsOrder.Web3
  }

  public toDirectSign(): MsgCancelBinaryOptionsOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder',
      message: proto,
    }
  }
}
