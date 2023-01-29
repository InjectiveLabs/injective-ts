import { MsgCreateSpotMarketOrder as BaseMsgCreateSpotMarketOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  SpotOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

export declare namespace MsgCreateSpotMarketOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
    message: BaseMsgCreateSpotMarketOrder
  }

  export interface Data extends BaseMsgCreateSpotMarketOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
  }
  export interface Amino extends BaseMsgCreateSpotMarketOrder {
    type: 'exchange/MsgCreateSpotMarketOrder'
  }

  export interface Web3 extends BaseMsgCreateSpotMarketOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
  }

  export type Proto = BaseMsgCreateSpotMarketOrder
}

const createMarketOrder = (params: MsgCreateSpotMarketOrder.Params) => {
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

  const message = BaseMsgCreateSpotMarketOrder.create()
  message.sender = params.injectiveAddress
  message.order = spotOrder

  return BaseMsgCreateSpotMarketOrder.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCreateSpotMarketOrder extends MsgBase<
  MsgCreateSpotMarketOrder.Params,
  MsgCreateSpotMarketOrder.Data,
  MsgCreateSpotMarketOrder.Proto,
  MsgCreateSpotMarketOrder.Amino,
  MsgCreateSpotMarketOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateSpotMarketOrder.Params,
  ): MsgCreateSpotMarketOrder {
    return new MsgCreateSpotMarketOrder(params)
  }

  public toProto(): MsgCreateSpotMarketOrder.Proto {
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

  public toData(): MsgCreateSpotMarketOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCreateSpotMarketOrder.Amino {
    const { params } = this
    const proto = createMarketOrder(params)

    return {
      type: 'exchange/MsgCreateSpotMarketOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateSpotMarketOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...rest,
    } as unknown as MsgCreateSpotMarketOrder.Web3
  }

  public toDirectSign(): MsgCreateSpotMarketOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateSpotMarketOrder.encode(this.toProto()).finish()
  }
}
