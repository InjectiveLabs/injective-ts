import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveTokenFactoryV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgBurn {
  export interface Params {
    sender: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgBurn
}

/**
 * @category Messages
 */
export default class MsgBurn extends MsgBase<MsgBurn.Params, MsgBurn.Proto> {
  static fromJSON(params: MsgBurn.Params): MsgBurn {
    return new MsgBurn(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgBurn.create()
    message.sender = params.sender
    message.amount = params.amount

    return InjectiveTokenFactoryV1Beta1Tx.MsgBurn.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgBurn',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'injective/tokenfactory/burn',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgBurn',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgBurn',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1Tx.MsgBurn.encode(
      this.toProto(),
    ).finish()
  }
}
