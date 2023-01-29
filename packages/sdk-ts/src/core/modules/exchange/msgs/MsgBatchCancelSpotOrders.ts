import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import {
  MsgBatchCancelSpotOrders as BaseMsgBatchCancelSpotOrders,
  OrderData,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelSpotOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
      orderMask?: OrderMask
    }[]
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
    message: BaseMsgBatchCancelSpotOrders
  }

  export interface Data extends BaseMsgBatchCancelSpotOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
  }

  export interface Amino extends BaseMsgBatchCancelSpotOrders {
    type: 'exchange/MsgBatchCancelSpotOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelSpotOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
  }

  export type Proto = BaseMsgBatchCancelSpotOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrders.Params,
  MsgBatchCancelSpotOrders.Data,
  MsgBatchCancelSpotOrders.Proto,
  MsgBatchCancelSpotOrders.Amino,
  MsgBatchCancelSpotOrders.DirectSign
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrders.Params,
  ): MsgBatchCancelSpotOrders {
    return new MsgBatchCancelSpotOrders(params)
  }

  public toProto(): MsgBatchCancelSpotOrders.Proto {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = OrderData.create()
      orderData.marketId = order.marketId
      orderData.orderHash = order.orderHash
      orderData.subaccountId = order.subaccountId

      // TODO: Send order.orderMask instead when chain handles order mask properly.
      orderData.orderMask = OrderMask.ANY

      return orderData
    })

    const message = BaseMsgBatchCancelSpotOrders.create()
    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return BaseMsgBatchCancelSpotOrders.fromPartial(message)
  }

  public toData(): MsgBatchCancelSpotOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...proto,
    }
  }

  public toAmino(): MsgBatchCancelSpotOrders.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgBatchCancelSpotOrders',
      ...snakeCaseKeys({
        sender: proto.sender,
        data: [...proto.data],
      }),
    } as unknown as MsgBatchCancelSpotOrders.Amino
  }

  public toWeb3(): MsgBatchCancelSpotOrders.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...rest,
    } as unknown as MsgBatchCancelSpotOrders.Web3
  }

  public toDirectSign(): MsgBatchCancelSpotOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgBatchCancelSpotOrders.encode(this.toProto()).finish()
  }
}
