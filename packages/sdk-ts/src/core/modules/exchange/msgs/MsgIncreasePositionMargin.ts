import { MsgIncreasePositionMargin as BaseMsgIncreasePositionMargin } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
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
}

const createMessage = (params: MsgIncreasePositionMargin.Params) => {
  const message = BaseMsgIncreasePositionMargin.create()

  message.sender = params.injectiveAddress
  message.amount = params.amount
  message.marketId = params.marketId
  message.sourceSubaccountId = params.srcSubaccountId
  message.destinationSubaccountId = params.dstSubaccountId

  return BaseMsgIncreasePositionMargin.fromPartial(message)
}

/**
 * @category Messages
 */
export default class MsgIncreasePositionMargin extends MsgBase<
  MsgIncreasePositionMargin.Params,
  MsgIncreasePositionMargin.Proto
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

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const proto = createMessage(params)
    const message = {
      ...snakecaseKeys(proto),
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

  public toBinary(): Uint8Array {
    return BaseMsgIncreasePositionMargin.encode(this.toProto()).finish()
  }
}
