import { MsgCreateDerivativeLimitOrder as BaseMsgCreateDerivativeLimitOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  DerivativeOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

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

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
    message: BaseMsgCreateDerivativeLimitOrder
  }

  export interface Data extends BaseMsgCreateDerivativeLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
  }

  export interface Amino extends BaseMsgCreateDerivativeLimitOrder {
    type: 'exchange/MsgCreateDerivativeLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateDerivativeLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
  }
  export type Proto = BaseMsgCreateDerivativeLimitOrder
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
  MsgCreateDerivativeLimitOrder.Data,
  MsgCreateDerivativeLimitOrder.Proto,
  MsgCreateDerivativeLimitOrder.Amino,
  MsgCreateDerivativeLimitOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateDerivativeLimitOrder.Params,
  ): MsgCreateDerivativeLimitOrder {
    return new MsgCreateDerivativeLimitOrder(params)
  }

  public toProto(): MsgCreateDerivativeLimitOrder.Proto {
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

  public toData(): MsgCreateDerivativeLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCreateDerivativeLimitOrder.Amino {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      type: 'exchange/MsgCreateDerivativeLimitOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateDerivativeLimitOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
      ...rest,
    } as unknown as MsgCreateDerivativeLimitOrder.Web3
  }

  public toDirectSign(): MsgCreateDerivativeLimitOrder.DirectSign {
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
