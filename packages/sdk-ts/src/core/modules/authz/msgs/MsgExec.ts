import { MsgExec as BaseMsgExec } from '@injectivelabs/chain-api/cosmos/authz/v1beta1/tx_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
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

    const message = new BaseMsgExec()
    message.setGrantee(params.grantee)

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]
    const actualMsgs = msgs.map((msg) => {
      const msgValue = new Any()
      msgValue.setTypeUrl(msg.toData()['@type'])
      msgValue.setValue(msg.toProto().serializeBinary())

      return msgValue
    })

    message.setMsgsList(actualMsgs)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
      msgs: proto.getMsgsList(),
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
}
