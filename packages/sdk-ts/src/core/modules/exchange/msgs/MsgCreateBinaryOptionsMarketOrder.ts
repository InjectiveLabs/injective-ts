import { MsgCreateBinaryOptionsMarketOrder as BaseMsgCreateBinaryOptionsMarketOrder } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import {
  DerivativeOrder,
  OrderInfo,
  OrderType,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

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
  MsgCreateBinaryOptionsMarketOrder.Proto
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
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createMarketOrder(params)
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCreateBinaryOptionsMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<BaseMsgCreateBinaryOptionsMarketOrder>,
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

  public toBinary(): Uint8Array {
    return BaseMsgCreateBinaryOptionsMarketOrder.encode(this.toProto()).finish()
  }
}
