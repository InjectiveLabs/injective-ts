import { MsgCreateBinaryOptionsLimitOrder as BaseMsgCreateBinaryOptionsLimitOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = BaseMsgCreateBinaryOptionsLimitOrder

  export type Object = BaseMsgCreateBinaryOptionsLimitOrder.AsObject
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
  MsgCreateBinaryOptionsLimitOrder.Proto,
  MsgCreateBinaryOptionsLimitOrder.Object
> {
  static fromJSON(
    params: MsgCreateBinaryOptionsLimitOrder.Params,
  ): MsgCreateBinaryOptionsLimitOrder {
    return new MsgCreateBinaryOptionsLimitOrder(params)
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
    } as MsgCreateBinaryOptionsLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
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
      type: 'exchange/MsgCreateBinaryOptionsLimitOrder',
      value:
        message as unknown as SnakeCaseKeys<MsgCreateBinaryOptionsLimitOrder.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder',
      message: proto,
    }
  }
}
