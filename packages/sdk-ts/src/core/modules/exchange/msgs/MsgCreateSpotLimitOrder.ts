import { MsgBase } from '../../MsgBase'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  InjectiveExchangeV1Beta1Exchange,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateSpotLimitOrder {
  export interface Params {
    marketId: string
    subaccountId: string
    injectiveAddress: string
    orderType: InjectiveExchangeV1Beta1Exchange.OrderType
    triggerPrice?: string
    feeRecipient: string
    price: string
    quantity: string
    cid?: string
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgCreateSpotLimitOrder
}

const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
  const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
  orderInfo.subaccountId = params.subaccountId
  orderInfo.feeRecipient = params.feeRecipient
  orderInfo.price = params.price
  orderInfo.quantity = params.quantity

    if (params.cid) {
      orderInfo.cid = params.cid
    }

  const spotOrder = InjectiveExchangeV1Beta1Exchange.SpotOrder.create()
  spotOrder.marketId = params.marketId
  spotOrder.orderType = params.orderType
  spotOrder.orderInfo = orderInfo

  spotOrder.triggerPrice = params.triggerPrice || '0'

  const message = InjectiveExchangeV1Beta1Tx.MsgCreateSpotLimitOrder.create()
  message.sender = params.injectiveAddress
  message.order = spotOrder

  return InjectiveExchangeV1Beta1Tx.MsgCreateSpotLimitOrder.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgCreateSpotLimitOrder extends MsgBase<
  MsgCreateSpotLimitOrder.Params,
  MsgCreateSpotLimitOrder.Proto
> {
  static fromJSON(
    params: MsgCreateSpotLimitOrder.Params,
  ): MsgCreateSpotLimitOrder {
    return new MsgCreateSpotLimitOrder(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      price: amountToCosmosSdkDecAmount(initialParams.price).toFixed(),
      triggerPrice: amountToCosmosSdkDecAmount(
        initialParams.triggerPrice || 0,
      ).toFixed(),
      quantity: amountToCosmosSdkDecAmount(initialParams.quantity).toFixed(),
    } as MsgCreateSpotLimitOrder.Params

    return createLimitOrder(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createLimitOrder(params)
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgCreateSpotLimitOrder',
      value:
        message as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1Tx.MsgCreateSpotLimitOrder>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgCreateSpotLimitOrder.encode(
      this.toProto(),
    ).finish()
  }
}
