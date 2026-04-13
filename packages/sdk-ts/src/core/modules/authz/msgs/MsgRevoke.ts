import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type snakecaseKeys from 'snakecase-keys'

type SnakeCaseKeys<T extends Record<string, any> | readonly any[]> =
  snakecaseKeys.SnakeCaseKeys<T>

export declare namespace MsgRevoke {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
  }

  export type Proto = CosmosAuthzV1Beta1TxPb.MsgRevoke
}

/**
 * @category Messages
 */
export default class MsgRevoke extends MsgBase<
  MsgRevoke.Params,
  MsgRevoke.Proto
> {
  static fromJSON(params: MsgRevoke.Params): MsgRevoke {
    return new MsgRevoke(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosAuthzV1Beta1TxPb.MsgRevoke.create({
      granter: params.granter,
      grantee: params.grantee,
      msgTypeUrl: params.messageType,
    })

    return message
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
      granter: proto.granter,
      grantee: proto.grantee,
      msg_type_url: proto.msgTypeUrl,
    }

    return {
      type: 'cosmos-sdk/MsgRevoke',
      value:
        message as unknown as SnakeCaseKeys<CosmosAuthzV1Beta1TxPb.MsgRevoke>,
    }
  }

  public toWeb3Gw() {
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
    return CosmosAuthzV1Beta1TxPb.MsgRevoke.toBinary(this.toProto())
  }
}
