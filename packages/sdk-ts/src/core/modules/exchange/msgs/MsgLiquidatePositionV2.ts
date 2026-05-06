import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import {
  objectKeysToEip712Types,
  patchOrderTypesWithExpirationBlock,
} from '../../../tx/eip712/maps.js'

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
      expirationBlock?: string
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
      expirationBlock: params.order.expirationBlock
        ? BigInt(params.order.expirationBlock)
        : BigInt(0),
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
    const { params } = this
    const message = {
      sender: params.injectiveAddress,
      subaccount_id: params.subaccountId,
      market_id: params.marketId,
      order: params.order
        ? {
            market_id: params.order.marketId,
            order_info: {
              subaccount_id: params.order.subaccountId,
              fee_recipient: params.order.feeRecipient,
              price: params.order.price,
              quantity: params.order.quantity,
              cid: params.order.cid || '',
            },
            order_type: params.order.orderType,
            margin: params.order.margin,
            trigger_price: params.order.triggerPrice || '0',
            expiration_block: params.order.expirationBlock || '0',
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
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const order = web3gw.order as any

    const messageAdjusted = {
      ...web3gw,
      order: params.order
        ? {
            ...order,
            order_info: {
              ...order?.order_info,
              price: numberToCosmosSdkDecString(params.order.price),
              quantity: numberToCosmosSdkDecString(params.order.quantity),
            },
            margin: numberToCosmosSdkDecString(params.order.margin),
            trigger_price: numberToCosmosSdkDecString(
              params.order.triggerPrice || '0',
            ),
            order_type:
              InjectiveExchangeV2OrderPb.OrderType[params.order.orderType],
          }
        : null,
    }

    return messageAdjusted
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino
    const { expiration_block: _eb, ...orderWithoutExpiration } =
      (value.order as any) || {}

    const messageAdjusted = {
      ...value,
      order: params.order
        ? {
            ...orderWithoutExpiration,
            order_info: {
              ...orderWithoutExpiration?.order_info,
              price: toChainFormat(params.order.price).toFixed(),
              quantity: toChainFormat(params.order.quantity).toFixed(),
            },
            margin: toChainFormat(params.order.margin).toFixed(),
            trigger_price: toChainFormat(
              params.order.triggerPrice || '0',
            ).toFixed(),
          }
        : undefined,
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toEip712Types() {
    const eip712 = this.toEip712()

    const result = objectKeysToEip712Types({
      object: eip712.value as Record<string, any>,
      messageType: eip712.type,
    })

    return patchOrderTypesWithExpirationBlock(result, ['TypeOrder'])
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
