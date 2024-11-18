import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveInsuranceV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgUnderwrite {
  export interface Params {
    marketId: string
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
  }

  export type Proto = InjectiveInsuranceV1Beta1Tx.MsgUnderwrite
}

/**
 * @category Messages
 */
export default class MsgUnderwrite extends MsgBase<
  MsgUnderwrite.Params,
  MsgUnderwrite.Proto
> {
  static fromJSON(params: MsgUnderwrite.Params): MsgUnderwrite {
    return new MsgUnderwrite(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()

    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveInsuranceV1Beta1Tx.MsgUnderwrite.create()

    message.sender = params.injectiveAddress
    message.marketId = params.marketId
    message.deposit = amountCoin

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'insurance/MsgUnderwrite',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.insurance.v1beta1.MsgUnderwrite',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgUnderwrite',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1Tx.MsgUnderwrite.encode(
      this.toProto(),
    ).finish()
  }
}
