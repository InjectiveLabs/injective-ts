import { MsgBase } from '../../MsgBase.js'
import { amountToCosmosSdkDecAmount, numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateSpotMarketOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    quantity: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCreateSpotMarketOrder
}

const createMarketOrder = (params: MsgCreateSpotMarketOrder.Params) => {
  const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()

  orderInfo.subaccountId = params.subaccountId
  orderInfo.feeRecipient = params.feeRecipient
  orderInfo.price = params.price
  orderInfo.quantity = params.quantity

  if (params.cid) {
    orderInfo.cid = params.cid
  }

  const spotOrder = InjectiveExchangeV1Beta1Exchange.SpotOrder.create()

  spotOrder.marketId = params.marketId
  spotOrder.orderInfo = orderInfo
  spotOrder.orderType = params.orderType
  spotOrder.triggerPrice = params.triggerPrice || '0'

  const message = InjectiveExchangeV1Beta1Tx.MsgCreateSpotMarketOrder.create()

  message.sender = params.injectiveAddress
  message.order = spotOrder

  return InjectiveExchangeV1Beta1Tx.MsgCreateSpotMarketOrder.fromPartial(
    message,
  )
}

/**
 * @category Messages
 */
export default class MsgCreateSpotMarketOrder extends MsgBase<
  MsgCreateSpotMarketOrder.Params,
  MsgCreateSpotMarketOrder.Proto
> {
  static fromJSON(
    params: MsgCreateSpotMarketOrder.Params,
  ): MsgCreateSpotMarketOrder {
    return new MsgCreateSpotMarketOrder(params)
  }

  public toProto() {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateSpotMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const order = createMarketOrder(params)
    const message = {
      ...snakecaseKeys(order),
    }

    return {
      type: 'exchange/MsgCreateSpotMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgCreateSpotMarketOrder>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
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
        order_type: InjectiveExchangeV1Beta1Exchange.orderTypeToJSON(
          params.orderType,
        ),
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
          price: amountToCosmosSdkDecAmount(params.price).toFixed(),
          quantity: amountToCosmosSdkDecAmount(params.quantity).toFixed(),
        },
        trigger_price: amountToCosmosSdkDecAmount(
          params.triggerPrice || '0',
        ).toFixed(),
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
      type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgCreateSpotMarketOrder.encode(
      this.toProto(),
    ).finish()
  }
}
