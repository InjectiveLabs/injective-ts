import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import {
  MsgBatchCancelDerivativeOrders as BaseMsgBatchCancelDerivativeOrders,
  OrderData,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelDerivativeOrders {
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
    type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
    message: BaseMsgBatchCancelDerivativeOrders
  }

  export interface Data extends BaseMsgBatchCancelDerivativeOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
  }

  export interface Amino extends BaseMsgBatchCancelDerivativeOrders {
    type: 'exchange/MsgBatchCancelDerivativeOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelDerivativeOrders {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
  }

  export type Proto = BaseMsgBatchCancelDerivativeOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrders.Params,
  MsgBatchCancelDerivativeOrders.Data,
  MsgBatchCancelDerivativeOrders.Proto,
  MsgBatchCancelDerivativeOrders.Amino,
  MsgBatchCancelDerivativeOrders.DirectSign
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrders.Params,
  ): MsgBatchCancelDerivativeOrders {
    return new MsgBatchCancelDerivativeOrders(params)
  }

  public toProto(): MsgBatchCancelDerivativeOrders.Proto {
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

    const message = BaseMsgBatchCancelDerivativeOrders.create()
    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return BaseMsgBatchCancelDerivativeOrders.fromPartial(message)
  }

  public toData(): MsgBatchCancelDerivativeOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...proto,
    }
  }

  public toAmino(): MsgBatchCancelDerivativeOrders.Amino {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgBatchCancelDerivativeOrders',
      ...snakeCaseKeys({
        sender: proto.sender,
        data: [...proto.data],
      }),
    } as unknown as MsgBatchCancelDerivativeOrders.Amino
  }

  public toWeb3(): MsgBatchCancelDerivativeOrders.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...rest,
    } as unknown as MsgBatchCancelDerivativeOrders.Web3
  }

  public toDirectSign(): MsgBatchCancelDerivativeOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgBatchCancelDerivativeOrders.encode(this.toProto()).finish()
  }
}
