import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString, amountToCosmosSdkDecAmount } from '../../../../utils/numbers.js'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateBinaryOptionsMarketOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    margin: string
    quantity: string
    cid?: string
  }

  export type Proto =
    InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder
}

const createMarketOrder = (
  params: MsgCreateBinaryOptionsMarketOrder.Params,
) => {
  const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()

  orderInfo.subaccountId = params.subaccountId
  orderInfo.feeRecipient = params.feeRecipient
  orderInfo.price = params.price
  orderInfo.quantity = params.quantity

  if (params.cid) {
    orderInfo.cid = params.cid
  }

  const derivativeOrder =
    InjectiveExchangeV1Beta1Exchange.DerivativeOrder.create()

  derivativeOrder.marketId = params.marketId
  derivativeOrder.orderInfo = orderInfo
  derivativeOrder.orderType = params.orderType
  derivativeOrder.margin = params.margin
  derivativeOrder.triggerPrice = params.triggerPrice || '0'

  const message =
    InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder.create()

  message.sender = params.injectiveAddress
  message.order = derivativeOrder

  return InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder.fromPartial(
    message,
  )
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
    const order = createMarketOrder(params)
    const message = {
      ...snakecaseKeys(order),
    }

    return {
      type: 'exchange/MsgCreateBinaryOptionsMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder',
      ...value,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()
    const order = web3gw.order as any

    const messageAdjusted = {
      ...web3gw,
      order: {
        ...order,
        order_info: {
          ...order.order_info,
          price: numberToCosmosSdkDecString(params.price),
          quantity: numberToCosmosSdkDecString(params.quantity),
        },
        margin: numberToCosmosSdkDecString(params.margin),
        trigger_price: numberToCosmosSdkDecString(params.triggerPrice || '0'),
        order_type: InjectiveExchangeV1Beta1Exchange.orderTypeToJSON(
          params.orderType,
        ),
      },
    }

    return messageAdjusted
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino

    const messageAdjusted = {
      ...value,
      order: {
        ...value.order,
        order_info: {
          ...value.order?.order_info,
          price: amountToCosmosSdkDecAmount(params.price).toFixed(),
          quantity: amountToCosmosSdkDecAmount(params.quantity).toFixed(),
        },
        margin: amountToCosmosSdkDecAmount(params.margin).toFixed(),
        trigger_price: amountToCosmosSdkDecAmount(
          params.triggerPrice || '0',
        ).toFixed(),
      },
    }

    return {
      type,
      value: messageAdjusted,
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
    return InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder.encode(
      this.toProto(),
    ).finish()
  }
}
