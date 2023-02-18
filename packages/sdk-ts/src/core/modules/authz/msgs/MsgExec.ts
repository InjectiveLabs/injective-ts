import { MsgExec as BaseMsgExec } from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/tx'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'

export declare namespace MsgExec {
  export interface Params {
    grantee: string
    msgs: Msgs | Msgs[]
  }

  export type Proto = BaseMsgExec

  export type Object = BaseMsgExec.AsObject
}

/**
 * @category Messages
 */
export default class MsgExec extends MsgBase<
  MsgExec.Params,
  MsgExec.Proto,
  MsgExec.Object
> {
  static fromJSON(params: MsgExec.Params): MsgExec {
    return new MsgExec(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgExec.create()
    message.grantee = params.grantee

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]
    const actualMsgs = msgs.map((msg) => {
      const msgValue = Any.create()
      msgValue.typeUrl = msg.toData()['@type']
      msgValue.value = msg.toBinary()

      return msgValue
    })

    message.msgs = actualMsgs

    return BaseMsgExec.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
      msgs: proto.msgs,
    }

    return {
      type: 'cosmos-sdk/MsgExec',
      value: message as unknown as SnakeCaseKeys<MsgExec.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.authz.v1beta1.MsgExec',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgExec.encode(this.toProto()).finish()
  }
}
