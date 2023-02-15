import { MsgCreateSpotMarketOrder as BaseMsgCreateSpotMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  SpotOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = BaseMsgCreateSpotMarketOrder

  export type Object = BaseMsgCreateSpotMarketOrder.AsObject
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
  MsgCreateSpotMarketOrder.Proto,
  MsgCreateSpotMarketOrder.Object
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
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createMarketOrder(params)
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgCreateSpotMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<MsgCreateSpotMarketOrder.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotMarketOrder',
      message: proto,
    }
  }
}
