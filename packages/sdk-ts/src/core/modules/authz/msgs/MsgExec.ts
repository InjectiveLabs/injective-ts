import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { graftEip712Types } from '../../../tx/eip712/maps.js'
import type { Msgs } from '../../msgs.js'
import type { TypedDataField } from '../../../tx/eip712/types.js'

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

type Amino = { type: string; value: MsgExec.Object }

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

    const actualMsgs: GoogleProtobufAnyPbPb.Any[] = msgs.map(
      (msg): GoogleProtobufAnyPbPb.Any => {
        const msgValue = GoogleProtobufAnyPbPb.Any.create({
          typeUrl: msg.toDirectSign().type,
          value: msg.toBinary(),
        })

        return msgValue
      },
    )

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

  private compose(child: (msg: Msgs) => unknown): Amino {
    const { params } = this
    const msgs = Array.isArray(params.msgs) ? params.msgs : [params.msgs]

    return {
      type: 'cosmos-sdk/MsgExec',
      value: { grantee: params.grantee, msgs: msgs.map(child) },
    }
  }

  public toAmino(): Amino {
    return this.compose((msg) => msg.toAmino())
  }

  /** the first message's schema stands for all of them, as arrays are typed by their first entry */
  public toEip712Types(): Map<string, TypedDataField[]> {
    const { msgs } = this.params
    const [first] = Array.isArray(msgs) ? msgs : [msgs]
    const types = super.toEip712Types()

    return first
      ? graftEip712Types(types, 'TypeMsgsValue', first.toEip712Types())
      : types
  }

  public toEip712(): Amino {
    return this.compose((msg) => msg.toEip712())
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
      type: '/cosmos.authz.v1beta1.MsgExec' as const,
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosAuthzV1Beta1TxPb.MsgExec.toBinary(this.toProto())
  }
}
