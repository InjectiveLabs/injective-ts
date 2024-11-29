import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase.js'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBatchCancelDerivativeOrders {
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

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgBatchCancelDerivativeOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrders.Params,
  MsgBatchCancelDerivativeOrders.Proto
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrders.Params,
  ): MsgBatchCancelDerivativeOrders {
    return new MsgBatchCancelDerivativeOrders(params)
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
      InjectiveExchangeV1Beta1Tx.MsgBatchCancelDerivativeOrders.create()

    message.sender = params.injectiveAddress
    message.data = orderDataList.map((o) => o)

    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelDerivativeOrders.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgBatchCancelDerivativeOrders',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgBatchCancelDerivativeOrders>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgBatchCancelDerivativeOrders.encode(
      this.toProto(),
    ).finish()
  }
}
