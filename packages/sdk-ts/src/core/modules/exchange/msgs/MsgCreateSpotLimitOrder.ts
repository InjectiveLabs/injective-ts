import { MsgCreateSpotLimitOrder as BaseMsgCreateSpotLimitOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  SpotOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

export declare namespace MsgCreateSpotLimitOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    quantity: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
    message: BaseMsgCreateSpotLimitOrder
  }

  export interface Data extends BaseMsgCreateSpotLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
  }

  export interface Amino extends BaseMsgCreateSpotLimitOrder {
    type: 'exchange/MsgCreateSpotLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateSpotLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
  }

  export type Proto = BaseMsgCreateSpotLimitOrder
}

const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
  const orderInfo = OrderInfo.create()
  orderInfo.subaccountId = params.subaccountId
  orderInfo.feeRecipient = params.feeRecipient
  orderInfo.price = params.price
  orderInfo.quantity = params.quantity

  const spotOrder = SpotOrder.create()
  spotOrder.marketId = params.marketId
  spotOrder.orderType = params.orderType
  spotOrder.orderInfo = orderInfo

  spotOrder.triggerPrice = params.triggerPrice || '0'

  const message = BaseMsgCreateSpotLimitOrder.create()
  message.sender = params.injectiveAddress
  message.order = spotOrder

  return BaseMsgCreateSpotLimitOrder.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCreateSpotLimitOrder extends MsgBase<
  MsgCreateSpotLimitOrder.Params,
  MsgCreateSpotLimitOrder.Data,
  MsgCreateSpotLimitOrder.Proto,
  MsgCreateSpotLimitOrder.Amino,
  MsgCreateSpotLimitOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateSpotLimitOrder.Params,
  ): MsgCreateSpotLimitOrder {
    return new MsgCreateSpotLimitOrder(params)
  }

  public toProto(): MsgCreateSpotLimitOrder.Proto {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateSpotLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData(): MsgCreateSpotLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCreateSpotLimitOrder.Amino {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      type: 'exchange/MsgCreateSpotLimitOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateSpotLimitOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...rest,
    } as unknown as MsgCreateSpotLimitOrder.Web3
  }

  public toDirectSign(): MsgCreateSpotLimitOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateSpotLimitOrder.encode(this.toProto()).finish()
  }
}
