import { MsgCreateBinaryOptionsMarketOrder as BaseMsgCreateBinaryOptionsMarketOrder } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import {
  DerivativeOrder,
  OrderInfo,
  OrderTypeMap,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgCreateBinaryOptionsMarketOrder {
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

  export type Proto = BaseMsgCreateBinaryOptionsMarketOrder

  export type Object = BaseMsgCreateBinaryOptionsMarketOrder.AsObject
}

const createMarketOrder = (
  params: MsgCreateBinaryOptionsMarketOrder.Params,
) => {
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

  const message = new BaseMsgCreateBinaryOptionsMarketOrder()
  message.setSender(params.injectiveAddress)
  message.setOrder(derivativeOrder)

  return message
}

/**
 * @category Messages
 */
export default class MsgCreateBinaryOptionsMarketOrder extends MsgBase<
  MsgCreateBinaryOptionsMarketOrder.Params,
  MsgCreateBinaryOptionsMarketOrder.Proto,
  MsgCreateBinaryOptionsMarketOrder.Object
> {
  static fromJSON(
    params: MsgCreateBinaryOptionsMarketOrder.Params,
  ): MsgCreateBinaryOptionsMarketOrder {
    return new MsgCreateBinaryOptionsMarketOrder(params)
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
    } as MsgCreateBinaryOptionsMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
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
      type: 'exchange/MsgCreateBinaryOptionsMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<MsgCreateBinaryOptionsMarketOrder.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      message: proto,
    }
  }
}
