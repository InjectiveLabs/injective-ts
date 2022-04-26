import { MsgCreateSpotMarketOrder as BaseMsgCreateSpotMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../utils/numbers'

export declare namespace MsgCreateSpotMarketOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: OrderTypeMap[keyof OrderTypeMap]
    triggerPrice?: string
    feeRecipient: string
    price: string
    margin: string
    quantity: string
  }

  export interface Amino {
    type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
    message: BaseMsgCreateSpotMarketOrder
  }

  export interface Data extends BaseMsgCreateSpotMarketOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
  }

  export interface Web3 extends BaseMsgCreateSpotMarketOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
  }

  export type Proto = BaseMsgCreateSpotMarketOrder
}

const createMarketOrder = (params: MsgCreateSpotMarketOrder.Params) => {
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

  const message = new BaseMsgCreateSpotMarketOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

  return message
}

export default class MsgCreateSpotMarketOrder extends MsgBase<
  MsgCreateSpotMarketOrder.Params,
  MsgCreateSpotMarketOrder.Data,
  MsgCreateSpotMarketOrder.Proto,
  MsgCreateSpotMarketOrder.Web3,
  MsgCreateSpotMarketOrder.Amino
> {
  static fromJSON(
    params: MsgCreateSpotMarketOrder.Params,
  ): MsgCreateSpotMarketOrder {
    return new MsgCreateSpotMarketOrder(params)
  }

  toProto(): MsgCreateSpotMarketOrder.Proto {
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

  toData(): MsgCreateSpotMarketOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgCreateSpotMarketOrder.Web3 {
    const { params } = this
    const proto = createMarketOrder(params)

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...proto.toObject(),
    }
  }

  toAmino(): MsgCreateSpotMarketOrder.Amino {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      message: proto,
    }
  }
}
