import { MsgCreateBinaryOptionsMarketOrder as BaseMsgCreateBinaryOptionsMarketOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  DerivativeOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'

export declare namespace MsgCreateBinaryOptionsMarketOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder'
    message: BaseMsgCreateBinaryOptionsMarketOrder
  }

  export interface Data extends BaseMsgCreateBinaryOptionsMarketOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder'
  }

  export interface Amino extends BaseMsgCreateBinaryOptionsMarketOrder {
    type: 'exchange/MsgCreateBinaryOptionsMarketOrder'
  }

  export interface Web3 extends BaseMsgCreateBinaryOptionsMarketOrder {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder'
  }

  export type Proto = BaseMsgCreateBinaryOptionsMarketOrder
}

const createMarketOrder = (
  params: MsgCreateBinaryOptionsMarketOrder.Params,
) => {
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

  const message = BaseMsgCreateBinaryOptionsMarketOrder.create()
  message.sender = params.injectiveAddress
  message.order = derivativeOrder

  return BaseMsgCreateBinaryOptionsMarketOrder.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCreateBinaryOptionsMarketOrder extends MsgBase<
  MsgCreateBinaryOptionsMarketOrder.Params,
  MsgCreateBinaryOptionsMarketOrder.Data,
  MsgCreateBinaryOptionsMarketOrder.Proto,
  MsgCreateBinaryOptionsMarketOrder.Amino,
  MsgCreateBinaryOptionsMarketOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateBinaryOptionsMarketOrder.Params,
  ): MsgCreateBinaryOptionsMarketOrder {
    return new MsgCreateBinaryOptionsMarketOrder(params)
  }

  public toProto(): MsgCreateBinaryOptionsMarketOrder.Proto {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(initialParams.margin).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateBinaryOptionsMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData(): MsgCreateBinaryOptionsMarketOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      ...proto,
    }
  }

  public toAmino(): MsgCreateBinaryOptionsMarketOrder.Amino {
    const { params } = this
    const proto = createMarketOrder(params)

    return {
      type: 'exchange/MsgCreateBinaryOptionsMarketOrder',
      ...proto,
    }
  }

  public toWeb3(): MsgCreateBinaryOptionsMarketOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      ...rest,
    } as unknown as MsgCreateBinaryOptionsMarketOrder.Web3
  }

  public toDirectSign(): MsgCreateBinaryOptionsMarketOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgCreateBinaryOptionsMarketOrder.encode(this.toProto()).finish()
  }
}
