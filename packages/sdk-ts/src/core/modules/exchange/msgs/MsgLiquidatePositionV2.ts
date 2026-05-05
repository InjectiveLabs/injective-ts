import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgLiquidatePositionV2 {
  export interface Params {
    subaccountId: string
    injectiveAddress: string
    marketId: string

    /** optional order to provide for liquidation */
    order?: {
      marketId: string
      subaccountId: string
      orderType: InjectiveExchangeV2OrderPb.OrderType
      triggerPrice?: string
      feeRecipient: string
      price: string
      margin: string
      quantity: string
      cid?: string
    }
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgLiquidatePosition
}

const createMessage = (params: MsgLiquidatePositionV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgLiquidatePosition.create({
    sender: params.injectiveAddress,
    subaccountId: params.subaccountId,
    marketId: params.marketId,
  })

  if (params.order) {
    const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
      subaccountId: params.order.subaccountId,
      feeRecipient: params.order.feeRecipient,
      price: params.order.price,
      quantity: params.order.quantity,
      cid: params.order.cid || '',
    })

    const order = InjectiveExchangeV2OrderPb.DerivativeOrder.create({
      marketId: params.order.marketId,
      margin: params.order.margin,
      orderInfo: orderInfo,
      orderType: params.order.orderType,
      triggerPrice: params.order.triggerPrice || '0',
    })

    message.order = order
  }

  return message
}

/**
 * @category Messages
 */
export default class MsgLiquidatePositionV2 extends MsgBase<
  MsgLiquidatePositionV2.Params,
  MsgLiquidatePositionV2.Proto
> {
  static fromJSON(
    params: MsgLiquidatePositionV2.Params,
  ): MsgLiquidatePositionV2 {
    return new MsgLiquidatePositionV2(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      order: initialParams.order
        ? {
            ...initialParams.order,
            price: toChainFormat(initialParams.order.price).toFixed(),
            margin: toChainFormat(initialParams.order.margin).toFixed(),
            triggerPrice: toChainFormat(
              initialParams.order.triggerPrice || 0,
            ).toFixed(),
            quantity: toChainFormat(initialParams.order.quantity).toFixed(),
          }
        : undefined,
    } as MsgLiquidatePositionV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgLiquidatePosition',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      subaccount_id: proto.subaccountId,
      market_id: proto.marketId,
      order: proto.order
        ? {
            market_id: proto.order.marketId,
            order_info: {
              subaccount_id: proto.order.orderInfo?.subaccountId,
              fee_recipient: proto.order.orderInfo?.feeRecipient,
              price: proto.order.orderInfo?.price,
              quantity: proto.order.orderInfo?.quantity,
              cid: proto.order.orderInfo?.cid,
            },
            order_type: proto.order.orderType,
            margin: proto.order.margin,
            trigger_price: proto.order.triggerPrice,
          }
        : undefined,
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
      '@type': '/injective.exchange.v2.MsgLiquidatePosition',
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
            order_type: InjectiveExchangeV2OrderPb.OrderType[order.order_type],
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
              price: toChainFormat(order?.order_info?.price || '0').toFixed(),
              quantity: toChainFormat(
                order?.order_info?.quantity || '0',
              ).toFixed(),
            },
            margin: toChainFormat(order.margin).toFixed(),
            trigger_price: toChainFormat(order.trigger_price || '0').toFixed(),
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
      type: '/injective.exchange.v2.MsgLiquidatePosition',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgLiquidatePosition.toBinary(this.toProto())
  }
}
