import { MsgIncreasePositionMargin as BaseMsgIncreasePositionMargin } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { amountToCosmosSdkDecAmount } from '../../../utils/numbers'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgIncreasePositionMargin {
  export interface Params {
    marketId: string
    injectiveAddress: string
    srcSubaccountId: string
    dstSubaccountId: string
    amount: string
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
    message: BaseMsgIncreasePositionMargin
  }

  export interface Data extends BaseMsgIncreasePositionMargin.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
  }

  export interface Amino extends BaseMsgIncreasePositionMargin.AsObject {
    type: 'exchange/MsgIncreasePositionMargin'
  }

  export interface Web3 extends BaseMsgIncreasePositionMargin.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
  }

  export type Proto = BaseMsgIncreasePositionMargin
}

const addMarginToPosition = (params: MsgIncreasePositionMargin.Params) => {
  const message = new BaseMsgIncreasePositionMargin()
  message.setSender(params.injectiveAddress)
  message.setAmount(params.amount)
  message.setMarketId(params.marketId)
  message.setSourceSubaccountId(params.srcSubaccountId)
  message.setDestinationSubaccountId(params.dstSubaccountId)

  return message
}

/**
 * @category Messages
 */
export default class MsgIncreasePositionMargin extends MsgBase<
  MsgIncreasePositionMargin.Params,
  MsgIncreasePositionMargin.Data,
  MsgIncreasePositionMargin.Proto,
  MsgIncreasePositionMargin.Amino,
  MsgIncreasePositionMargin.DirectSign
> {
  static fromJSON(
    params: MsgIncreasePositionMargin.Params,
  ): MsgIncreasePositionMargin {
    return new MsgIncreasePositionMargin(params)
  }

  public toProto(): MsgIncreasePositionMargin.Proto {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      amount: amountToCosmosSdkDecAmount(initialParams.amount).toFixed(),
    } as MsgIncreasePositionMargin.Params

    return addMarginToPosition(params)
  }

  public toData(): MsgIncreasePositionMargin.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgIncreasePositionMargin.Amino {
    const { params } = this
    const proto = addMarginToPosition(params)

    return {
      type: 'exchange/MsgIncreasePositionMargin',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgIncreasePositionMargin.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...rest,
    } as unknown as MsgIncreasePositionMargin.Web3
  }

  public toDirectSign(): MsgIncreasePositionMargin.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      message: proto,
    }
  }
}
