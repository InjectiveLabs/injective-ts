import { MsgCreateBinaryOptionsLimitOrder as BaseMsgCreateBinaryOptionsLimitOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  OrderInfo,
  OrderType,
  DerivativeOrder,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

export declare namespace MsgCreateBinaryOptionsLimitOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
    message: BaseMsgCreateBinaryOptionsLimitOrder
  }

  export interface Data extends BaseMsgCreateBinaryOptionsLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
  }

  export interface Amino extends BaseMsgCreateBinaryOptionsLimitOrder {
    type: 'exchange/MsgCreateBinaryOptionsLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateBinaryOptionsLimitOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
  }

  export type Proto = BaseMsgCreateBinaryOptionsLimitOrder
}

const createLimitOrder = (params: MsgCreateBinaryOptionsLimitOrder.Params) => {
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

  const message = BaseMsgCreateBinaryOptionsLimitOrder.create()
  message.sender = params.injectiveAddress
  message.order = derivativeOrder

  return BaseMsgCreateBinaryOptionsLimitOrder.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCreateBinaryOptionsLimitOrder extends MsgBase<
  MsgCreateBinaryOptionsLimitOrder.Params,
  MsgCreateBinaryOptionsLimitOrder.Data,
  MsgCreateBinaryOptionsLimitOrder.Proto,
  MsgCreateBinaryOptionsLimitOrder.Amino,
  MsgCreateBinaryOptionsLimitOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateBinaryOptionsLimitOrder.Params,
  ): MsgCreateBinaryOptionsLimitOrder {
    return new MsgCreateBinaryOptionsLimitOrder(params)
  }

  public toProto(): MsgCreateBinaryOptionsLimitOrder.Proto {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(initialParams.margin).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateBinaryOptionsLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData(): MsgCreateBinaryOptionsLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCreateBinaryOptionsLimitOrder.Amino {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      type: 'exchange/MsgCreateBinaryOptionsLimitOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateBinaryOptionsLimitOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      ...rest,
    } as unknown as MsgCreateBinaryOptionsLimitOrder.Web3
  }

  public toDirectSign(): MsgCreateBinaryOptionsLimitOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateBinaryOptionsLimitOrder.encode(this.toProto()).finish()
  }
}
