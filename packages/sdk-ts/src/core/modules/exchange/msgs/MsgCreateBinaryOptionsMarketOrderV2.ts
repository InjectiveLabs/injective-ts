import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgCreateBinaryOptionsMarketOrderV2 {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: InjectiveExchangeV2OrderPb.OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    margin: string
    quantity: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgCreateBinaryOptionsMarketOrder
}

const createMarketOrder = (
  params: MsgCreateBinaryOptionsMarketOrderV2.Params,
) => {
  const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
    subaccountId: params.subaccountId,
    feeRecipient: params.feeRecipient,
    price: params.price,
    quantity: params.quantity,
    cid: params.cid || '',
  })

  const derivativeOrder = InjectiveExchangeV2OrderPb.DerivativeOrder.create({
    marketId: params.marketId,
    orderInfo: orderInfo,
    orderType: params.orderType,
    margin: params.margin,
    triggerPrice: params.triggerPrice || '0',
  })

  const message =
    InjectiveExchangeV2TxPb.MsgCreateBinaryOptionsMarketOrder.create({
      sender: params.injectiveAddress,
      order: derivativeOrder,
    })

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateBinaryOptionsMarketOrderV2 extends MsgBase<
  MsgCreateBinaryOptionsMarketOrderV2.Params,
  MsgCreateBinaryOptionsMarketOrderV2.Proto
> {
  static fromJSON(
    params: MsgCreateBinaryOptionsMarketOrderV2.Params,
  ): MsgCreateBinaryOptionsMarketOrderV2 {
    return new MsgCreateBinaryOptionsMarketOrderV2(params)
  }

  public toProto() {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: toChainFormat(initialParams.price).toFixed(),
      margin: toChainFormat(initialParams.margin).toFixed(),
      triggerPrice: toChainFormat(initialParams.triggerPrice || 0).toFixed(),
      quantity: toChainFormat(initialParams.quantity).toFixed(),
    } as MsgCreateBinaryOptionsMarketOrderV2.Params

    return createMarketOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgCreateBinaryOptionsMarketOrder',
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
        margin: params.margin,
        trigger_price: params.triggerPrice || '0',
      },
    }

    return {
      type: 'exchange/MsgCreateBinaryOptionsMarketOrder',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgCreateBinaryOptionsMarketOrder',
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
        margin: numberToCosmosSdkDecString(params.margin),
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

    const messageAdjusted = {
      ...value,
      order: {
        ...value.order,
        order_info: {
          ...value.order?.order_info,
          price: toChainFormat(params.price).toFixed(),
          quantity: toChainFormat(params.quantity).toFixed(),
        },
        margin: toChainFormat(params.margin).toFixed(),
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
      type: '/injective.exchange.v2.MsgCreateBinaryOptionsMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgCreateBinaryOptionsMarketOrder.toBinary(
      this.toProto(),
    )
  }
}
