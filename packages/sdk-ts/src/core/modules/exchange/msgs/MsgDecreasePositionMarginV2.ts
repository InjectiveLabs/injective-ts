import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgDecreasePositionMarginV2 {
  export interface Params {
    marketId: string
    injectiveAddress: string
    srcSubaccountId: string
    dstSubaccountId: string
    amount: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgDecreasePositionMargin
}

const createMessage = (params: MsgDecreasePositionMarginV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgDecreasePositionMargin.create({
    sender: params.injectiveAddress,
    sourceSubaccountId: params.srcSubaccountId,
    destinationSubaccountId: params.dstSubaccountId,
    marketId: params.marketId,
    amount: params.amount,
  })

  return message
}

/**
 * @category Messages
 */
export default class MsgDecreasePositionMarginV2 extends MsgBase<
  MsgDecreasePositionMarginV2.Params,
  MsgDecreasePositionMarginV2.Proto
> {
  static fromJSON(
    params: MsgDecreasePositionMarginV2.Params,
  ): MsgDecreasePositionMarginV2 {
    return new MsgDecreasePositionMarginV2(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      amount: toChainFormat(initialParams.amount).toFixed(),
    } as MsgDecreasePositionMarginV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgDecreasePositionMargin',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const message = {
      sender: params.injectiveAddress,
      source_subaccount_id: params.srcSubaccountId,
      destination_subaccount_id: params.dstSubaccountId,
      market_id: params.marketId,
      amount: params.amount,
    }

    return {
      type: 'exchange/MsgDecreasePositionMargin',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgDecreasePositionMargin',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
      amount: toChainFormat(value.amount).toFixed(),
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      amount: numberToCosmosSdkDecString(params.amount),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgDecreasePositionMargin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgDecreasePositionMargin.toBinary(
      this.toProto(),
    )
  }
}
