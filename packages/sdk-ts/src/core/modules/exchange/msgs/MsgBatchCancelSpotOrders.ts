import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBatchCancelSpotOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash?: string
      orderMask?: InjectiveExchangeV1Beta1Exchange.OrderMask
      cid?: string
    }[]
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgBatchCancelSpotOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrders.Params,
  MsgBatchCancelSpotOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrders.Params,
  ): MsgBatchCancelSpotOrders {
    return new MsgBatchCancelSpotOrders(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = InjectiveExchangeV1Beta1Tx.OrderData.create()

      orderData.marketId = order.marketId
      orderData.subaccountId = order.subaccountId

      if (order.orderHash) {
        orderData.orderHash = order.orderHash
      }

      // TODO: Send order.orderMask instead when chain handles order mask properly.
      orderData.orderMask = InjectiveExchangeV1Beta1Exchange.OrderMask.ANY

      if (order.cid) {
        orderData.cid = order.cid
      }

      return orderData
    })

    const message = InjectiveExchangeV1Beta1Tx.MsgBatchCancelSpotOrders.create()

    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelSpotOrders.fromPartial(
      message,
    )
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
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgBatchCancelSpotOrders>,
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
    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelSpotOrders.encode(
      this.toProto(),
    ).finish()
  }
}
