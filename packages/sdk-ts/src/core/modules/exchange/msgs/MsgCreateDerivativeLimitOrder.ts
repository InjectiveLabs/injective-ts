import { MsgCreateDerivativeLimitOrder as BaseMsgCreateDerivativeLimitOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  DerivativeOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgCreateDerivativeLimitOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    margin: string
    quantity: string
  }

  export type Proto = BaseMsgCreateDerivativeLimitOrder

  export type Object = BaseMsgCreateDerivativeLimitOrder.AsObject
}

const createLimitOrder = (params: MsgCreateDerivativeLimitOrder.Params) => {
  const orderInfo = OrderInfo.create()
  orderInfo.subaccountId = params.subaccountId
  orderInfo.feeRecipient = params.feeRecipient
  orderInfo.price = params.price
  orderInfo.quantity = params.quantity

  const derivativeOrder = DerivativeOrder.create()
  derivativeOrder.marketId = params.marketId
  derivativeOrder.orderType = params.orderType
  derivativeOrder.orderInfo = orderInfo
  derivativeOrder.margin = params.margin

  derivativeOrder.triggerPrice = params.triggerPrice || '0'

  const message = BaseMsgCreateDerivativeLimitOrder.create()
  message.sender = params.injectiveAddress
  message.order = derivativeOrder

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateDerivativeLimitOrder extends MsgBase<
  MsgCreateDerivativeLimitOrder.Params,
  MsgCreateDerivativeLimitOrder.Proto,
  MsgCreateDerivativeLimitOrder.Object
> {
  static fromJSON(
    params: MsgCreateDerivativeLimitOrder.Params,
  ): MsgCreateDerivativeLimitOrder {
    return new MsgCreateDerivativeLimitOrder(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(initialParams.margin).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateDerivativeLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
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
      type: 'exchange/MsgCreateDerivativeLimitOrder',
      value:
        message as unknown as SnakeCaseKeys<MsgCreateDerivativeLimitOrder.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateDerivativeLimitOrder.encode(this.toProto()).finish()
  }
}
