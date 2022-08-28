import { MsgCreateDerivativeLimitOrder as BaseMsgCreateDerivativeLimitOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import {
  amountToCosmosSdkDecAmount,
  getTriggerPrice,
} from '../../../utils/numbers'

export declare namespace MsgCreateDerivativeLimitOrder {
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

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
    message: BaseMsgCreateDerivativeLimitOrder
  }

  export interface Data extends BaseMsgCreateDerivativeLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
  }

  export interface Amino extends BaseMsgCreateDerivativeLimitOrder.AsObject {
    type: 'exchange/MsgCreateDerivativeLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateDerivativeLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder'
  }
  export type Proto = BaseMsgCreateDerivativeLimitOrder
}

const createLimitOrder = (params: MsgCreateDerivativeLimitOrder.Params) => {
  const orderInfo = new OrderInfo()
  orderInfo.setSubaccountId(params.subaccountId)
  orderInfo.setFeeRecipient(params.feeRecipient)
  orderInfo.setPrice(params.price)
  orderInfo.setQuantity(params.quantity)

  const derivativeOrder = new DerivativeOrder()
  derivativeOrder.setMarketId(params.marketId)
  derivativeOrder.setOrderType(params.orderType)
  derivativeOrder.setOrderInfo(orderInfo)
  derivativeOrder.setMargin(params.margin)

  derivativeOrder.setTriggerPrice(params.triggerPrice || '0')

  const message = new BaseMsgCreateDerivativeLimitOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

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
      triggerPrice: getTriggerPrice(initialParams.triggerPrice),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateDerivativeLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData(): MsgCreateDerivativeLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCreateDerivativeLimitOrder.Amino {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      type: 'exchange/MsgCreateDerivativeLimitOrder',
      ...proto.toObject(),
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
}
