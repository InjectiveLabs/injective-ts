import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  MsgBatchCancelDerivativeOrders as BaseMsgBatchCancelDerivativeOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { OrderMask } from '../../../../types/exchange'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelDerivativeOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
      orderMask?: OrderMaskMap[keyof OrderMaskMap]
    }[]
  }

  export type Proto = BaseMsgBatchCancelDerivativeOrders

  export type Object = BaseMsgBatchCancelDerivativeOrders.AsObject
}

/**
 * @category Messages
 */
export default class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrders.Params,
  MsgBatchCancelDerivativeOrders.Proto,
  MsgBatchCancelDerivativeOrders.Object
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrders.Params,
  ): MsgBatchCancelDerivativeOrders {
    return new MsgBatchCancelDerivativeOrders(params)
  }

  public toProto() {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      // TODO: Send order.orderMask instead when chain handles order mask properly.
      orderData.setOrderMask(OrderMask.Any)

      return orderData
    })

    const message = new BaseMsgBatchCancelDerivativeOrders()
    message.setSender(params.injectiveAddress)
    message.setDataList(orderDataList.map((o) => o))

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgBatchCancelDerivativeOrders',
      value: {
        sender: message.sender,
        data: message.data_list,
      } as unknown as SnakeCaseKeys<MsgBatchCancelDerivativeOrders.Object>,
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
}
