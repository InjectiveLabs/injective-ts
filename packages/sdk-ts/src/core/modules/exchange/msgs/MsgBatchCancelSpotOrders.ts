import { OrderMask } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import {
  MsgBatchCancelSpotOrders as BaseMsgBatchCancelSpotOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
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

  export type Proto = BaseMsgBatchCancelSpotOrders

  export type Object = BaseMsgBatchCancelSpotOrders.AsObject
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrders.Params,
  MsgBatchCancelSpotOrders.Proto,
  MsgBatchCancelSpotOrders.Object
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrders.Params,
  ): MsgBatchCancelSpotOrders {
    return new MsgBatchCancelSpotOrders(params)
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

    const message = BaseMsgBatchCancelSpotOrders.create()
    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return BaseMsgBatchCancelSpotOrders.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgBatchCancelSpotOrders',
      value: {
        sender: message.sender,
        data: message.data_list,
      } as unknown as SnakeCaseKeys<MsgBatchCancelSpotOrders.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...value,
    }
  }

  public toDirectSign() {
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
