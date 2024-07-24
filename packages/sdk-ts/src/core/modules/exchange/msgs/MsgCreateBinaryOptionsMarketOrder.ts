import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
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
    return InjectiveExchangeV1Beta1Tx.MsgCreateBinaryOptionsMarketOrder.encode(
      this.toProto(),
    ).finish()
  }
}
