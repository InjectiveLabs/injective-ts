import {
  MsgBatchCancelBinaryOptionsOrders as BaseMsgBatchCancelBinaryOptionsOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelBinaryOptionsOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
    message: BaseMsgBatchCancelBinaryOptionsOrders
  }

  export interface Data extends BaseMsgBatchCancelBinaryOptionsOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
  }

  export interface Amino
    extends BaseMsgBatchCancelBinaryOptionsOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders'
  }

  export type Proto = BaseMsgBatchCancelBinaryOptionsOrders
}

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

  toProto(): MsgBatchCancelBinaryOptionsOrders.Proto {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return orderData
    })

    const message = new BaseMsgBatchCancelBinaryOptionsOrders()
    message.setSender(params.injectiveAddress)
    message.setDataList(orderDataList.map((o) => o))

    return message
  }

  toData(): MsgBatchCancelBinaryOptionsOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgBatchCancelBinaryOptionsOrders.Amino {
    const proto = this.toProto()
    const orderData = proto
      .getDataList()
      .map((orderData) => snakeCaseKeys(orderData.toObject()))

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      ...snakeCaseKeys({
        sender: proto.getSender(),
        data: [...orderData],
      }),
    } as unknown as MsgBatchCancelBinaryOptionsOrders.Amino
  }

  toDirectSign(): MsgBatchCancelBinaryOptionsOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders',
      message: proto,
    }
  }
}
