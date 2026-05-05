import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgIncreasePositionMarginV2 {
  export interface Params {
    marketId: string
    injectiveAddress: string
    srcSubaccountId: string
    dstSubaccountId: string
    amount: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgIncreasePositionMargin
}

const createMessage = (params: MsgIncreasePositionMarginV2.Params) => {
  const message = InjectiveExchangeV2TxPb.MsgIncreasePositionMargin.create({
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
export default class MsgIncreasePositionMarginV2 extends MsgBase<
  MsgIncreasePositionMarginV2.Params,
  MsgIncreasePositionMarginV2.Proto
> {
  static fromJSON(
    params: MsgIncreasePositionMarginV2.Params,
  ): MsgIncreasePositionMarginV2 {
    return new MsgIncreasePositionMarginV2(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      amount: toChainFormat(initialParams.amount).toFixed(),
    } as MsgIncreasePositionMarginV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgIncreasePositionMargin',
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
      type: 'exchange/MsgIncreasePositionMargin',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgIncreasePositionMargin',
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
      type: '/injective.exchange.v2.MsgIncreasePositionMargin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgIncreasePositionMargin.toBinary(
      this.toProto(),
    )
  }
}
