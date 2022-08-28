import {
  MsgBatchCancelSpotOrders as BaseMsgBatchCancelSpotOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBatchCancelSpotOrders {
  export interface Params {
    injectiveAddress: string
    orders: {
      marketId: string
      subaccountId: string
      orderHash: string
    }[]
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
    message: BaseMsgBatchCancelSpotOrders
  }

  export interface Data extends BaseMsgBatchCancelSpotOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
  }

  export interface Amino extends BaseMsgBatchCancelSpotOrders.AsObject {
    type: 'exchange/MsgBatchCancelSpotOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelSpotOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders'
  }

  export type Proto = BaseMsgBatchCancelSpotOrders
}

/**
 * @category Messages
 */
export default class MsgBatchCancelSpotOrders extends MsgBase<
  MsgBatchCancelSpotOrders.Params,
  MsgBatchCancelSpotOrders.Data,
  MsgBatchCancelSpotOrders.Proto,
  MsgBatchCancelSpotOrders.Amino,
  MsgBatchCancelSpotOrders.DirectSign
> {
  static fromJSON(
    params: MsgBatchCancelSpotOrders.Params,
  ): MsgBatchCancelSpotOrders {
    return new MsgBatchCancelSpotOrders(params)
  }

  public toProto(): MsgBatchCancelSpotOrders.Proto {
    const { params } = this

    const orderDataList = params.orders.map((order) => {
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)

      return orderData
    })

    const message = new BaseMsgBatchCancelSpotOrders()
    message.setSender(params.injectiveAddress)
    message.setDataList(orderDataList.map((o) => o))

    return message
  }

  public toData(): MsgBatchCancelSpotOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgBatchCancelSpotOrders.Amino {
    const proto = this.toProto()
    const orderData = proto
      .getDataList()
      .map((orderData) => snakeCaseKeys(orderData.toObject()))

    return {
      type: 'exchange/MsgBatchCancelSpotOrders',
      ...snakeCaseKeys({
        sender: proto.getSender(),
        data: [...orderData],
      }),
    } as unknown as MsgBatchCancelSpotOrders.Amino
  }

  public toWeb3(): MsgBatchCancelSpotOrders.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      ...rest,
    } as unknown as MsgBatchCancelSpotOrders.Web3
  }

  public toDirectSign(): MsgBatchCancelSpotOrders.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchCancelSpotOrders',
      message: proto,
    }
  }
}
