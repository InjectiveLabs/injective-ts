import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import type { Msgs } from '../../msgs.js'

export declare namespace MsgExec {
  export interface Params {
    grantee: string
    msgs: Msgs | Msgs[]
  }

  export type Proto = CosmosAuthzV1Beta1TxPb.MsgExec

  export type Object = Omit<CosmosAuthzV1Beta1TxPb.MsgExec, 'msgs'> & {
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

    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    const actualMsgs = msgs.map((msg) => {
      const msgValue = GoogleProtobufAnyPb.Any.create({
        typeUrl: msg.toDirectSign().type,
        value: msg.toBinary(),
      })

      return msgValue
    })

    const message = CosmosAuthzV1Beta1TxPb.MsgExec.create({
      grantee: params.grantee,
      msgs: actualMsgs,
    })

    return message
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
    return CosmosAuthzV1Beta1TxPb.MsgExec.toBinary(this.toProto())
  }
}
