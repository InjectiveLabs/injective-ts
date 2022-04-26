import {
  MsgBatchCancelDerivativeOrders as BaseMsgBatchCancelDerivativeOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelDerivativeOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
  }

  export interface Amino {
    type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
    message: BaseMsgBatchCancelDerivativeOrders
  }

  export interface Data extends BaseMsgBatchCancelDerivativeOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelDerivativeOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
  }

  export type Proto = BaseMsgBatchCancelDerivativeOrders
}

export default class MsgBatchCancelDerivativeOrders extends MsgBase<
  MsgBatchCancelDerivativeOrders.Params,
  MsgBatchCancelDerivativeOrders.Data,
  MsgBatchCancelDerivativeOrders.Proto,
  MsgBatchCancelDerivativeOrders.Web3,
  MsgBatchCancelDerivativeOrders.Amino
> {
  static fromJSON(
    params: MsgBatchCancelDerivativeOrders.Params,
  ): MsgBatchCancelDerivativeOrders {
    return new MsgBatchCancelDerivativeOrders(params)
  }

  toProto(): MsgBatchCancelDerivativeOrders.Proto {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return orderData
    })

    const message = new BaseMsgBatchCancelDerivativeOrders()
    message.setSender(params.injectiveAddress)
    message.setDataList(orderDataList.map((o) => o))

    return message
  }

  toData(): MsgBatchCancelDerivativeOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgBatchCancelDerivativeOrders.Web3 {
    const proto = this.toProto()
    const orderData = proto
      .getDataList()
      .map((orderData) => snakeCaseKeys(orderData.toObject()))

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...snakeCaseKeys({
        sender: proto.getSender(),
        data: [...orderData],
      }),
    } as unknown as MsgBatchCancelDerivativeOrders.Web3
  }

  toAmino(): MsgBatchCancelDerivativeOrders.Amino {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      message: proto,
    }
  }
}
