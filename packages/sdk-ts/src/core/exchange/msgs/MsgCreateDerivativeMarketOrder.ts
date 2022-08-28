import { MsgCreateDerivativeMarketOrder as BaseMsgCreateDerivativeMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
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

export declare namespace MsgCreateDerivativeMarketOrder {
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
    type: '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder'
    message: BaseMsgCreateDerivativeMarketOrder
  }

  export interface Data extends BaseMsgCreateDerivativeMarketOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder'
  }

  export interface Amino extends BaseMsgCreateDerivativeMarketOrder.AsObject {
    type: 'exchange/MsgCreateDerivativeMarketOrder'
  }

  export interface Web3 extends BaseMsgCreateDerivativeMarketOrder.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder'
  }

  export type Proto = BaseMsgCreateDerivativeMarketOrder
}

const createMarketOrder = (params: MsgCreateDerivativeMarketOrder.Params) => {
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

  const message = new BaseMsgCreateDerivativeMarketOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateDerivativeMarketOrder extends MsgBase<
  MsgCreateDerivativeMarketOrder.Params,
  MsgCreateDerivativeMarketOrder.Data,
  MsgCreateDerivativeMarketOrder.Proto,
  MsgCreateDerivativeMarketOrder.Amino,
  MsgCreateDerivativeMarketOrder.DirectSign
> {
  static fromJSON(
    params: MsgCreateDerivativeMarketOrder.Params,
  ): MsgCreateDerivativeMarketOrder {
    return new MsgCreateDerivativeMarketOrder(params)
  }

  public toProto(): MsgCreateDerivativeMarketOrder.Proto {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      margin: amountToCosmosSdkDecAmount(initialParams.margin).toFixed(),
      triggerPrice: getTriggerPrice(initialParams.triggerPrice),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateDerivativeMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData(): MsgCreateDerivativeMarketOrder.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgCreateDerivativeMarketOrder.Amino {
    const { params } = this
    const proto = createMarketOrder(params)

    return {
      type: 'exchange/MsgCreateDerivativeMarketOrder',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgCreateDerivativeMarketOrder.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
      ...rest,
    } as unknown as MsgCreateDerivativeMarketOrder.Web3
  }

  public toDirectSign(): MsgCreateDerivativeMarketOrder.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
      message: proto,
    }
  }
}
