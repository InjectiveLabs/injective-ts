import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import {
  MsgBatchCancelBinaryOptionsOrders as BaseMsgBatchCancelBinaryOptionsOrders,
  OrderData,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelBinaryOptionsOrders {
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
    type: '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
    message: BaseMsgBatchCancelBinaryOptionsOrders
  }

  export interface Data extends BaseMsgBatchCancelBinaryOptionsOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
  }

  export interface Amino extends BaseMsgBatchCancelBinaryOptionsOrders {
    type: 'exchange/MsgBatchCancelBinaryOptionsOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelBinaryOptionsOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
  }

  export type Proto = BaseMsgBatchCancelBinaryOptionsOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelBinaryOptionsOrders extends MsgBase<
  MsgBatchCancelBinaryOptionsOrders.Params,
  MsgBatchCancelBinaryOptionsOrders.Data,
  MsgBatchCancelBinaryOptionsOrders.Proto,
  MsgBatchCancelBinaryOptionsOrders.Amino,
  MsgBatchCancelBinaryOptionsOrders.DirectSign
> {
  static fromJSON(
    params: MsgBatchCancelBinaryOptionsOrders.Params,
  ): MsgBatchCancelBinaryOptionsOrders {
    return new MsgBatchCancelBinaryOptionsOrders(params)
  }

  public toProto(): MsgBatchCancelBinaryOptionsOrders.Proto {
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

    const message = BaseMsgBatchCancelBinaryOptionsOrders.create()
    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return BaseMsgBatchCancelBinaryOptionsOrders.fromPartial(message)
  }

  public toData(): MsgBatchCancelBinaryOptionsOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...proto,
    }
  }

  public toAmino(): MsgBatchCancelBinaryOptionsOrders.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgBatchCancelBinaryOptionsOrders',
      ...snakeCaseKeys({
        sender: proto.sender,
        data: [...proto.data],
      }),
    } as unknown as MsgBatchCancelBinaryOptionsOrders.Amino
  }

  public toWeb3(): MsgBatchCancelBinaryOptionsOrders.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...rest,
    } as unknown as MsgBatchCancelBinaryOptionsOrders.Web3
  }

  public toDirectSign(): MsgBatchCancelBinaryOptionsOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgBatchCancelBinaryOptionsOrders.encode(this.toProto()).finish()
  }
}
