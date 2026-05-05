import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgCreateSpotMarketOrderV2 {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: InjectiveExchangeV2OrderPb.OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    quantity: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgCreateSpotMarketOrder
}

const createMarketOrder = (params: MsgCreateSpotMarketOrderV2.Params) => {
  const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
    subaccountId: params.subaccountId,
    feeRecipient: params.feeRecipient,
    price: params.price,
    quantity: params.quantity,
    cid: params.cid || '',
  })

  const spotOrder = InjectiveExchangeV2OrderPb.SpotOrder.create({
    marketId: params.marketId,
    orderInfo: orderInfo,
    orderType: params.orderType,
    triggerPrice: params.triggerPrice || '0',
    expirationBlock: BigInt(0),
  })

  const message = InjectiveExchangeV2TxPb.MsgCreateSpotMarketOrder.create({
    sender: params.injectiveAddress,
    order: spotOrder,
  })

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateSpotMarketOrderV2 extends MsgBase<
  MsgCreateSpotMarketOrderV2.Params,
  MsgCreateSpotMarketOrderV2.Proto
> {
  static fromJSON(
    params: MsgCreateSpotMarketOrderV2.Params,
  ): MsgCreateSpotMarketOrderV2 {
    return new MsgCreateSpotMarketOrderV2(params)
  }

  public toProto() {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: toChainFormat(initialParams.price).toFixed(),
      triggerPrice: toChainFormat(initialParams.triggerPrice || 0).toFixed(),
      quantity: toChainFormat(initialParams.quantity).toFixed(),
    } as MsgCreateSpotMarketOrderV2.Params

    return createMarketOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCreateSpotMarketOrder',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const message = {
      sender: params.injectiveAddress,
      order: {
        market_id: params.marketId,
        order_info: {
          subaccount_id: params.subaccountId,
          fee_recipient: params.feeRecipient,
          price: params.price,
          quantity: params.quantity,
          cid: params.cid || '',
        },
        order_type: params.orderType,
        trigger_price: params.triggerPrice || '0',
        expiration_block: '0',
      },
    }

    return {
      type: 'exchange/MsgCreateSpotMarketOrder',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgCreateSpotMarketOrder',
      ...value,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const order = web3gw.order as any

    const messageAdjusted = {
      ...web3gw,
      order: {
        ...order,
        order_info: {
          ...order.order_info,
          price: numberToCosmosSdkDecString(params.price),
          quantity: numberToCosmosSdkDecString(params.quantity),
        },
        trigger_price: numberToCosmosSdkDecString(params.triggerPrice || '0'),
        order_type: InjectiveExchangeV2OrderPb.OrderType[params.orderType],
      },
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
      order: {
        ...orderWithoutExpiration,
        order_info: {
          ...orderWithoutExpiration?.order_info,
          price: toChainFormat(params.price).toFixed(),
          quantity: toChainFormat(params.quantity).toFixed(),
        },
        trigger_price: toChainFormat(params.triggerPrice || '0').toFixed(),
      },
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgCreateSpotMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgCreateSpotMarketOrder.toBinary(
      this.toProto(),
    )
  }
}
