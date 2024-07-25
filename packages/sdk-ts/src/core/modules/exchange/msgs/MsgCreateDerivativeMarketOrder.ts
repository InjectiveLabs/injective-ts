import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateDerivativeMarketOrder {
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

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCreateDerivativeMarketOrder
}

const createMarketOrder = (params: MsgCreateDerivativeMarketOrder.Params) => {
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
    InjectiveExchangeV1Beta1Tx.MsgCreateDerivativeMarketOrder.create()

  message.sender = params.injectiveAddress
  message.order = derivativeOrder

  return InjectiveExchangeV1Beta1Tx.MsgCreateDerivativeMarketOrder.fromPartial(
    message,
  )
}

/**
 * @category Messages
 */
export default class MsgCreateDerivativeMarketOrder extends MsgBase<
  MsgCreateDerivativeMarketOrder.Params,
  MsgCreateDerivativeMarketOrder.Proto
> {
  static fromJSON(
    params: MsgCreateDerivativeMarketOrder.Params,
  ): MsgCreateDerivativeMarketOrder {
    return new MsgCreateDerivativeMarketOrder(params)
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
    } as MsgCreateDerivativeMarketOrder.Params

    return createMarketOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
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
      type: 'exchange/MsgCreateDerivativeMarketOrder',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgCreateDerivativeMarketOrder>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgCreateDerivativeMarketOrder.encode(
      this.toProto(),
    ).finish()
  }
}
