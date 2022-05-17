import { MsgCreateSpotLimitOrder as BaseMsgCreateSpotLimitOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../utils/numbers'

export declare namespace MsgCreateSpotLimitOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: OrderTypeMap[keyof OrderTypeMap]
    triggerPrice?: string
    feeRecipient: string
    price: string
    quantity: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
    message: BaseMsgCreateSpotLimitOrder
  }

  export interface Data extends BaseMsgCreateSpotLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateSpotLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder'
  }

  export type Proto = BaseMsgCreateSpotLimitOrder
}

const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
  const orderInfo = new OrderInfo()
  orderInfo.setSubaccountId(params.subaccountId)
  orderInfo.setFeeRecipient(params.feeRecipient)
  orderInfo.setPrice(params.price)
  orderInfo.setQuantity(params.quantity)

  const derivativeOrder = new SpotOrder()
  derivativeOrder.setMarketId(params.marketId)
  derivativeOrder.setOrderType(params.orderType)
  derivativeOrder.setOrderInfo(orderInfo)

  if (params.triggerPrice) {
    derivativeOrder.setTriggerPrice(params.triggerPrice)
  }

  const message = new BaseMsgCreateSpotLimitOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

  return message
}

export default class MsgCreateSpotLimitOrder extends MsgBase<
  MsgCreateSpotLimitOrder.Params,
  MsgCreateSpotLimitOrder.Data,
  MsgCreateSpotLimitOrder.Proto,
  MsgCreateSpotLimitOrder.Web3,
  MsgCreateSpotLimitOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateSpotLimitOrder.Params,
  ): MsgCreateSpotLimitOrder {
    return new MsgCreateSpotLimitOrder(params)
  }

  toProto(): MsgCreateSpotLimitOrder.Proto {
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

  toData(): MsgCreateSpotLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgCreateSpotLimitOrder.Web3 {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgCreateSpotLimitOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      message: proto,
    }
  }
}
