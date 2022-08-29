import { MsgCreateSpotMarketOrder as BaseMsgCreateSpotMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import {
  amountToCosmosSdkDecAmount,
  getTriggerPrice,
} from '../../../utils/numbers'

export declare namespace MsgCreateSpotMarketOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
    message: BaseMsgCreateSpotMarketOrder
  }

  export interface Data extends BaseMsgCreateSpotMarketOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder'
  }
  export interface Amino extends BaseMsgCreateSpotMarketOrder.AsObject {
    type: 'exchange/MsgCreateSpotMarketOrder'
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

  const spotOrder = new SpotOrder()
  spotOrder.setMarketId(params.marketId)
  spotOrder.setOrderType(params.orderType)
  spotOrder.setOrderInfo(orderInfo)

  spotOrder.setTriggerPrice(params.triggerPrice || '0')

  const message = new BaseMsgCreateSpotMarketOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(spotOrder)

  return message
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
      triggerPrice: getTriggerPrice(initialParams.triggerPrice),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateSpotMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData(): MsgCreateSpotMarketOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCreateSpotMarketOrder.Amino {
    const { params } = this
    const proto = createMarketOrder(params)

    return {
      type: 'exchange/MsgCreateSpotMarketOrder',
      ...proto.toObject(),
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
}
