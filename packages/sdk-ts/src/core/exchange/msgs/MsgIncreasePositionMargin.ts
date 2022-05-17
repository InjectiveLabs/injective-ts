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

export default class MsgIncreasePositionMargin extends MsgBase<
  MsgIncreasePositionMargin.Params,
  MsgIncreasePositionMargin.Data,
  MsgIncreasePositionMargin.Proto,
  MsgIncreasePositionMargin.Web3,
  MsgIncreasePositionMargin.DirectSign
> {
  static fromJSON(
    params: MsgIncreasePositionMargin.Params,
  ): MsgIncreasePositionMargin {
    return new MsgIncreasePositionMargin(params)
  }

  toProto(): MsgIncreasePositionMargin.Proto {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      amount: amountToCosmosSdkDecAmount(initialParams.amount).toFixed(),
    } as MsgIncreasePositionMargin.Params

    return addMarginToPosition(params)
  }

  toData(): MsgIncreasePositionMargin.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgIncreasePositionMargin.Web3 {
    const { params } = this
    const proto = addMarginToPosition(params)

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgIncreasePositionMargin.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      message: proto,
    }
  }
}
