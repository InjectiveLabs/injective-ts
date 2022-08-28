import { MsgCreateBinaryOptionsLimitOrder as BaseMsgCreateBinaryOptionsLimitOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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

export declare namespace MsgCreateBinaryOptionsLimitOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
    message: BaseMsgCreateBinaryOptionsLimitOrder
  }

  export interface Data extends BaseMsgCreateBinaryOptionsLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
  }

  export interface Amino extends BaseMsgCreateBinaryOptionsLimitOrder.AsObject {
    type: 'exchange/MsgCreateBinaryOptionsLimitOrder'
  }

  export interface Web3 extends BaseMsgCreateBinaryOptionsLimitOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder'
  }

  export type Proto = BaseMsgCreateBinaryOptionsLimitOrder
}

const createLimitOrder = (params: MsgCreateBinaryOptionsLimitOrder.Params) => {
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

  const message = new BaseMsgCreateBinaryOptionsLimitOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

  return message
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
      triggerPrice: getTriggerPrice(initialParams.triggerPrice),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateBinaryOptionsLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData(): MsgCreateBinaryOptionsLimitOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCreateBinaryOptionsLimitOrder.Amino {
    const { params } = this
    const proto = createLimitOrder(params)

    return {
      type: 'exchange/MsgCreateBinaryOptionsLimitOrder',
      ...proto.toObject(),
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
}
