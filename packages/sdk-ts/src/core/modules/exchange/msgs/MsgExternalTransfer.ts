import {
  CosmosBaseV1Beta1Coin,
  InjectiveExchangeV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgExternalTransfer {
  export interface Params {
    srcSubaccountId: string
    dstSubaccountId: string
    injectiveAddress: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveExchangeV1Beta1Tx.MsgExternalTransfer
}

/**
 * @category Messages
 */
export default class MsgExternalTransfer extends MsgBase<
  MsgExternalTransfer.Params,
  MsgExternalTransfer.Proto
> {
  static fromJSON(params: MsgExternalTransfer.Params): MsgExternalTransfer {
    return new MsgExternalTransfer(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()

    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveExchangeV1Beta1Tx.MsgExternalTransfer.create()

    message.sender = params.injectiveAddress
    message.sourceSubaccountId = params.srcSubaccountId
    message.destinationSubaccountId = params.dstSubaccountId
    message.amount = amountCoin

    return InjectiveExchangeV1Beta1Tx.MsgExternalTransfer.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgExternalTransfer',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgExternalTransfer',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgExternalTransfer',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgExternalTransfer.encode(
      this.toProto(),
    ).finish()
  }
}
