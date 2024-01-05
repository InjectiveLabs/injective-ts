import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveTokenFactoryV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateDenom {
  export interface Params {
    sender: string
    subdenom: string
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgCreateDenom
}

/**
 * @category Messages
 */
export default class MsgCreateDenom extends MsgBase<
  MsgCreateDenom.Params,
  MsgCreateDenom.Proto
> {
  static fromJSON(params: MsgCreateDenom.Params): MsgCreateDenom {
    return new MsgCreateDenom(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgCreateDenom.create()
    message.sender = params.sender
    message.subdenom = params.subdenom

    return InjectiveTokenFactoryV1Beta1Tx.MsgCreateDenom.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'injective/tokenfactory/create-denom',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgCreateDenom',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1Tx.MsgCreateDenom.encode(
      this.toProto(),
    ).finish()
  }
}
