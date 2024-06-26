import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { InjectiveTokenFactoryV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgChangeAdmin {
  export interface Params {
    sender: string
    denom: string
    newAdmin: string
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgChangeAdmin
}

/**
 * @category Messages
 */
export default class MsgChangeAdmin extends MsgBase<
  MsgChangeAdmin.Params,
  MsgChangeAdmin.Proto
> {
  static fromJSON(params: MsgChangeAdmin.Params): MsgChangeAdmin {
    return new MsgChangeAdmin(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgChangeAdmin.create()

    message.sender = params.sender
    message.denom = params.denom
    message.newAdmin = params.newAdmin

    return InjectiveTokenFactoryV1Beta1Tx.MsgChangeAdmin.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'injective/tokenfactory/change-admin',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgChangeAdmin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1Tx.MsgChangeAdmin.encode(
      this.toProto(),
    ).finish()
  }
}
