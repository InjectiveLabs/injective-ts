import { OrderMaskMap } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  MsgBatchCancelDerivativeOrders as BaseMsgBatchCancelDerivativeOrders,
  OrderData,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { OrderMask } from '../../../types/exchange'
import snakeCaseKeys from 'snakecase-keys'
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

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
    message: BaseMsgBatchCancelDerivativeOrders
  }

  export interface Data extends BaseMsgBatchCancelDerivativeOrders.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders'
  }

  export interface Amino extends BaseMsgBatchCancelDerivativeOrders.AsObject {
    type: 'exchange/MsgBatchCancelDerivativeOrders'
  }

  export interface Web3 extends BaseMsgBatchCancelDerivativeOrders.AsObject {
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
      const orderData = new OrderData()
      orderData.setMarketId(order.marketId)
      orderData.setOrderHash(order.orderHash)
      orderData.setSubaccountId(order.subaccountId)
      orderData.setOrderMask(
        order.orderMask !== undefined ? order.orderMask : OrderMask.Any,
      )

      return orderData
    })

    const message = new BaseMsgBatchCancelDerivativeOrders()
    message.setSender(params.injectiveAddress)
    message.setDataList(orderDataList.map((o) => o))

    return message
  }

  public toData(): MsgBatchCancelDerivativeOrders.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgBatchCancelDerivativeOrders.Amino {
    const proto = this.toProto()
    const orderData = proto
      .getDataList()
      .map((orderData) => snakeCaseKeys(orderData.toObject()))

    return {
      type: 'exchange/MsgBatchCancelDerivativeOrders',
      ...snakeCaseKeys({
        sender: proto.getSender(),
        data: [...orderData],
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
}
