import { MsgCreateSpotLimitOrder as BaseMsgCreateSpotLimitOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  SpotOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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
  MsgCreateSpotLimitOrder.Proto
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
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createLimitOrder(params)
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCreateSpotLimitOrder',
      value: message as unknown as SnakeCaseKeys<BaseMsgCreateSpotLimitOrder>,
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

  public toBinary(): Uint8Array {
    return BaseMsgCreateSpotLimitOrder.encode(this.toProto()).finish()
  }
}
