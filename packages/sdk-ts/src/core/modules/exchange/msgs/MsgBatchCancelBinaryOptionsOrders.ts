import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase.js'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBatchCancelBinaryOptionsOrders {
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

  export type Proto =
    InjectiveExchangeV1Beta1Tx.MsgBatchCancelBinaryOptionsOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelBinaryOptionsOrders extends MsgBase<
  MsgBatchCancelBinaryOptionsOrders.Params,
  MsgBatchCancelBinaryOptionsOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelBinaryOptionsOrders.Params,
  ): MsgBatchCancelBinaryOptionsOrders {
    return new MsgBatchCancelBinaryOptionsOrders(params)
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

    const message =
      InjectiveExchangeV1Beta1Tx.MsgBatchCancelBinaryOptionsOrders.create()
    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelBinaryOptionsOrders.fromPartial(
      message,
    )
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
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgBatchCancelBinaryOptionsOrders>,
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
    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelBinaryOptionsOrders.encode(
      this.toProto(),
    ).finish()
  }
}
