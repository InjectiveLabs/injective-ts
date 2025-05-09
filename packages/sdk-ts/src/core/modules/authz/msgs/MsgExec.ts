import { MsgBase } from '../../MsgBase.js'
import type { Msgs } from '../../msgs.js'
import {
  CosmosAuthzV1Beta1Tx,
  GoogleProtobufAny,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgExec {
  export interface Params {
    grantee: string
    msgs: Msgs | Msgs[]
  }

  export type Proto = CosmosAuthzV1Beta1Tx.MsgExec

  export type Object = Omit<CosmosAuthzV1Beta1Tx.MsgExec, 'msgs'> & {
    msgs: any
  }
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

    const message = CosmosAuthzV1Beta1Tx.MsgExec.create()

    if (params.grantee) {
      message.grantee = params.grantee
    }

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    const actualMsgs = msgs.map((msg) => {
      const msgValue = GoogleProtobufAny.Any.create()

      msgValue.typeUrl = msg.toDirectSign().type
      msgValue.value = msg.toBinary()

      return msgValue
    })

    message.msgs = actualMsgs

    return CosmosAuthzV1Beta1Tx.MsgExec.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    return {
      type: 'cosmos-sdk/MsgExec',
      value: {
        grantee: params.grantee,
        msgs: msgs.map((msg) => msg.toEip712()),
      } as unknown as MsgExec.Object,
    }
  }

  public toEip712V2() {
    const { params } = this

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      grantee: params.grantee,
      msgs: msgs.map((msg: any) => msg.toEip712V2()),
    }
  }

  public toWeb3Gw() {
    const { params } = this

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    return {
      '@type': '/cosmos.authz.v1beta1.MsgExec',
      grantee: params.grantee,
      msgs: msgs.map((msg: any) => msg.toWeb3()),
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
    return CosmosAuthzV1Beta1Tx.MsgExec.encode(this.toProto()).finish()
  }
}
