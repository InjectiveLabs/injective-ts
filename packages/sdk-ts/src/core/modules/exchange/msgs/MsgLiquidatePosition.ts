import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgLiquidatePosition {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    marketId: string

    /** optional order to provide for liquidation */
    order?: {
      marketId: string
      subaccountId: string
      orderType: InjectiveExchangeV1Beta1Exchange.OrderType
      triggerPrice?: string
      feeRecipient: string
      price: string
      margin: string
      quantity: string
      cid?: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgLiquidatePosition
}

/**
 * @category Messages
 */
export default class MsgLiquidatePosition extends MsgBase<
  MsgLiquidatePosition.Params,
  MsgLiquidatePosition.Proto
> {
  static fromJSON(params: MsgLiquidatePosition.Params): MsgLiquidatePosition {
    return new MsgLiquidatePosition(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveExchangeV1Beta1Tx.MsgLiquidatePosition.create()
    message.sender = params.injectiveAddress
    message.subaccountId = params.subaccountId
    message.marketId = params.marketId

    if (params.order) {
      const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
      orderInfo.subaccountId = params.order.subaccountId
      orderInfo.feeRecipient = params.order.feeRecipient
      orderInfo.price = params.order.price
      orderInfo.quantity = params.order.quantity

      if (params.order.cid) {
        orderInfo.cid = params.order.cid
      }

      const order = InjectiveExchangeV1Beta1Exchange.DerivativeOrder.create()

      order.marketId = params.order.marketId
      order.margin = params.order.margin
      order.triggerPrice = params.order.triggerPrice || '0'
    }

    return InjectiveExchangeV1Beta1Tx.MsgLiquidatePosition.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgLiquidatePosition',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgLiquidatePosition',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgLiquidatePosition',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgLiquidatePosition',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgLiquidatePosition.encode(
      this.toProto(),
    ).finish()
  }
}
