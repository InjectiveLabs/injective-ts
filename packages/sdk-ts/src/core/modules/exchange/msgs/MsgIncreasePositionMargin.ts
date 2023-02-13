import { MsgIncreasePositionMargin as BaseMsgIncreasePositionMargin } from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgIncreasePositionMargin {
  export interface Params {
    marketId: string
    injectiveAddress: string
    srcSubaccountId: string
    dstSubaccountId: string
    amount: string
  }

  export type Proto = BaseMsgIncreasePositionMargin

  export type Object = BaseMsgIncreasePositionMargin.AsObject
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
  MsgIncreasePositionMargin.Proto,
  MsgIncreasePositionMargin.Object
> {
  static fromJSON(
    params: MsgIncreasePositionMargin.Params,
  ): MsgIncreasePositionMargin {
    return new MsgIncreasePositionMargin(params)
  }

  public toProto() {
    const { params: initialParams } = this
    const params = {
      ...initialParams,
      amount: amountToCosmosSdkDecAmount(initialParams.amount).toFixed(),
    } as MsgIncreasePositionMargin.Params

    return addMarginToPosition(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const { params } = this
    const proto = addMarginToPosition(params)
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'exchange/MsgIncreasePositionMargin',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      message: proto,
    }
  }
}
