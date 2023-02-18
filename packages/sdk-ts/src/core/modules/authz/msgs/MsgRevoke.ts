import { MsgRevoke as BaseMsgRevoke } from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgRevoke {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
  }

  export type Proto = BaseMsgRevoke

  export type Object = BaseMsgRevoke.AsObject
}

/**
 * @category Messages
 */
export default class MsgRevoke extends MsgBase<
  MsgRevoke.Params,
  MsgRevoke.Proto,
  MsgRevoke.Object
> {
  static fromJSON(params: MsgRevoke.Params): MsgRevoke {
    return new MsgRevoke(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgRevoke.create()
    message.grantee = params.grantee
    message.granter = params.granter
    message.msgTypeUrl = params.messageType

    return BaseMsgRevoke.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgRevoke',
      value: message as unknown as SnakeCaseKeys<MsgRevoke.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgRevoke',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgRevoke',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgRevoke.encode(this.toProto()).finish()
  }
}
