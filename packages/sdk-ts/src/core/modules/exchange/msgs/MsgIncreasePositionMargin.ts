import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
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

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgIncreasePositionMargin
}

const createMessage = (params: MsgIncreasePositionMargin.Params) => {
  const message = InjectiveExchangeV1Beta1Tx.MsgIncreasePositionMargin.create()

  message.sender = params.injectiveAddress
  message.sourceSubaccountId = params.srcSubaccountId
  message.destinationSubaccountId = params.dstSubaccountId
  message.marketId = params.marketId
  message.amount = params.amount

  return InjectiveExchangeV1Beta1Tx.MsgIncreasePositionMargin.fromPartial(
    message,
  )
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
    return InjectiveExchangeV1Beta1Tx.MsgIncreasePositionMargin.encode(
      this.toProto(),
    ).finish()
  }
}
