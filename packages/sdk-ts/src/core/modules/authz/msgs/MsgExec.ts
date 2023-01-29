import { MsgExec as BaseMsgExec } from '@injectivelabs/core-proto-ts/cosmos/authz/v1beta1/tx'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'

import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'

export declare namespace MsgExec {
  export interface Params {
    grantee: string
    msgs: Msgs | Msgs[]
  }

  export interface DirectSign {
    type: '/cosmos.authz.v1beta1.MsgExec'
    message: BaseMsgExec
  }

  export interface Data extends BaseMsgExec {
    '@type': '/cosmos.authz.v1beta1.MsgExec'
  }

  export interface Amino extends BaseMsgExec {
    type: 'cosmos-sdk/MsgExec'
  }

  export interface Web3 extends BaseMsgExec {
    '@type': '/cosmos.authz.v1beta1.MsgExec'
  }

  export type Proto = BaseMsgExec
}

/**
 * @category Messages
 */
export default class MsgExec extends MsgBase<
  MsgExec.Params,
  MsgExec.Data,
  MsgExec.Proto,
  MsgExec.Amino,
  MsgExec.DirectSign
> {
  static fromJSON(params: MsgExec.Params): MsgExec {
    return new MsgExec(params)
  }

  public toProto(): MsgExec.Proto {
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

  public toData(): MsgExec.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...proto,
    }
  }

  public toAmino(): MsgExec.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgExec',
      ...proto,
    }
  }

  public toWeb3(): MsgExec.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...rest,
    }
  }

  public toDirectSign(): MsgExec.DirectSign {
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
