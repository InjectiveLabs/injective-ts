import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import {
  MsgBatchCancelBinaryOptionsOrders as BaseMsgBatchCancelBinaryOptionsOrders,
  OrderData,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
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

  export type Proto = BaseMsgBatchCancelBinaryOptionsOrders

  export type Object = BaseMsgBatchCancelBinaryOptionsOrders.AsObject
}

/**
 * @category Messages
 */
export default class MsgBatchCancelBinaryOptionsOrders extends MsgBase<
  MsgBatchCancelBinaryOptionsOrders.Params,
  MsgBatchCancelBinaryOptionsOrders.Proto,
  MsgBatchCancelBinaryOptionsOrders.Object
> {
  static fromJSON(
    params: MsgBatchCancelBinaryOptionsOrders.Params,
  ): MsgBatchCancelBinaryOptionsOrders {
    return new MsgBatchCancelBinaryOptionsOrders(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgBatchCancelBinaryOptionsOrders',
      value: {
        sender: message.sender,
        data: message.data_list,
      } as unknown as SnakeCaseKeys<MsgBatchCancelBinaryOptionsOrders.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...value,
    }
  }

  public toDirectSign() {
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
