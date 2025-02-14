import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  numberToCosmosSdkDecString,
  amountToCosmosSdkDecAmount,
} from '../../../../utils/numbers.js'

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

const createMessage = (params: MsgLiquidatePosition.Params) => {
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
    order.orderInfo = orderInfo
    order.orderType = params.order.orderType
    order.triggerPrice = params.order.triggerPrice || '0'

    message.order = order
  }

  return InjectiveExchangeV1Beta1Tx.MsgLiquidatePosition.fromPartial(message)
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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      order: initialParams.order
        ? {
            ...initialParams.order,
            price: amountToCosmosSdkDecAmount(
              initialParams.order.price,
            ).toFixed(),
            margin: amountToCosmosSdkDecAmount(
              initialParams.order.margin,
            ).toFixed(),
            triggerPrice: amountToCosmosSdkDecAmount(
              initialParams.order.triggerPrice || 0,
            ).toFixed(),
            quantity: amountToCosmosSdkDecAmount(
              initialParams.order.quantity,
            ).toFixed(),
          }
        : undefined,
    } as MsgLiquidatePosition.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgLiquidatePosition',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const order = createMessage(params)
    const message = {
      ...snakecaseKeys(order),
    }

    return {
      type: 'exchange/MsgLiquidatePosition',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgLiquidatePosition',
      ...value,
    }
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()
    const order = web3gw.order as any

    const messageAdjusted = {
      ...web3gw,
      order: order
        ? {
            ...order,
            order_info: {
              ...order?.order_info,
              price: numberToCosmosSdkDecString(order.order_info.price),
              quantity: numberToCosmosSdkDecString(order.order_info.quantity),
            },
            margin: numberToCosmosSdkDecString(order.margin),
            trigger_price: numberToCosmosSdkDecString(
              order.trigger_price || '0',
            ),
            order_type: InjectiveExchangeV1Beta1Exchange.orderTypeToJSON(
              order.order_type,
            ),
          }
        : undefined,
    }

    return messageAdjusted
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino
    const order = value.order as any

    const messageAdjusted = {
      ...value,
      order: params.order
        ? {
            ...order,
            order_info: {
              ...order?.order_info,
              price: amountToCosmosSdkDecAmount(order.order_info.price).toFixed(),
              quantity: amountToCosmosSdkDecAmount(order.order_info.quantity).toFixed(),
            },
            margin: amountToCosmosSdkDecAmount(order.margin).toFixed(),
            trigger_price: amountToCosmosSdkDecAmount(
              order.trigger_price || '0',
            ).toFixed(),
          }
        : undefined,
    }

    return {
      type,
      value: messageAdjusted,
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
