import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveTokenFactoryV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgMint {
  export interface Params {
    sender: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgMint
}

/**
 * @category Messages
 */
export default class MsgMint extends MsgBase<MsgMint.Params, MsgMint.Proto> {
  static fromJSON(params: MsgMint.Params): MsgMint {
    return new MsgMint(params)
  }

  public toProto() {
    const { params } = this

    const coin = CosmosBaseV1Beta1Coin.Coin.create()

    coin.denom = params.amount.denom
    coin.amount = params.amount.amount

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgMint.create()

    message.sender = params.sender
    message.amount = coin

    return InjectiveTokenFactoryV1Beta1Tx.MsgMint.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'injective/tokenfactory/mint',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgMint',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1Tx.MsgMint.encode(
      this.toProto(),
    ).finish()
  }
}
