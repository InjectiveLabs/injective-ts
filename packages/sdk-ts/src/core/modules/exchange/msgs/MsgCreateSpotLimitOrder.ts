import { MsgCreateSpotLimitOrder as BaseMsgCreateSpotLimitOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = BaseMsgCreateSpotLimitOrder

  export type Object = BaseMsgCreateSpotLimitOrder.AsObject
}

const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
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

  const message = new BaseMsgCreateSpotLimitOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(spotOrder)

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateSpotLimitOrder extends MsgBase<
  MsgCreateSpotLimitOrder.Params,
  MsgCreateSpotLimitOrder.Proto,
  MsgCreateSpotLimitOrder.Object
> {
  static fromJSON(
    params: MsgCreateSpotLimitOrder.Params,
  ): MsgCreateSpotLimitOrder {
    return new MsgCreateSpotLimitOrder(params)
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
    } as MsgCreateSpotLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createLimitOrder(params)
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgCreateSpotLimitOrder',
      value:
        message as unknown as SnakeCaseKeys<MsgCreateSpotLimitOrder.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      message: proto,
    }
  }
}
