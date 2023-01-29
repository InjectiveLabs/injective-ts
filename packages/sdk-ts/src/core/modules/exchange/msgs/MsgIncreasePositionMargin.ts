import { MsgIncreasePositionMargin as BaseMsgIncreasePositionMargin } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { amountToCosmosSdkDecAmount } from '../../../../utils/numbers'
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

  export interface Data extends BaseMsgIncreasePositionMargin {
    '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
  }

  export interface Amino extends BaseMsgIncreasePositionMargin {
    type: 'exchange/MsgIncreasePositionMargin'
  }

  export interface Web3 extends BaseMsgIncreasePositionMargin {
    '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
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

    return createMessage(params)
  }

  public toData(): MsgIncreasePositionMargin.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      ...proto,
    }
  }

  public toAmino(): MsgIncreasePositionMargin.Amino {
    const { params } = this
    const proto = createMessage(params)

    return {
      type: 'exchange/MsgIncreasePositionMargin',
      ...proto,
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

  public toBinary(): Uint8Array {
    return BaseMsgIncreasePositionMargin.encode(this.toProto()).finish()
  }
}
