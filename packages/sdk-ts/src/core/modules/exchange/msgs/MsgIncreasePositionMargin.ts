import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgIncreasePositionMargin {
  export interface Params {
    marketId: string
    injectiveAddress: string
    srcSubaccountId: string
    dstSubaccountId: string
    amount: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgIncreasePositionMargin
}

const createMessage = (params: MsgIncreasePositionMargin.Params) => {
  const message = InjectiveExchangeV1Beta1TxPb.MsgIncreasePositionMargin.create(
    {
      sender: params.injectiveAddress,
      sourceSubaccountId: params.srcSubaccountId,
      destinationSubaccountId: params.dstSubaccountId,
      marketId: params.marketId,
      amount: params.amount,
    },
  )

  return message
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
      amount: toChainFormat(initialParams.amount).toFixed(),
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
      '@type': '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
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
      type: '/injective.exchange.v1beta1.MsgIncreasePositionMargin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgIncreasePositionMargin.toBinary(
      this.toProto(),
    )
  }
}
