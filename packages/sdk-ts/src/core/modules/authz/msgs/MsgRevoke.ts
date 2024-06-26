import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { CosmosAuthzV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgRevoke {
  export interface Params {
    messageType: string
    grantee: string
    granter: string
  }

  export type Proto = CosmosAuthzV1Beta1Tx.MsgRevoke
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

    const message = CosmosAuthzV1Beta1Tx.MsgRevoke.create()
    message.granter = params.granter
    message.grantee = params.grantee
    message.msgTypeUrl = params.messageType

    return CosmosAuthzV1Beta1Tx.MsgRevoke.fromPartial(message)
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
      value:
        message as unknown as SnakeCaseKeys<CosmosAuthzV1Beta1Tx.MsgRevoke>,
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
    return CosmosAuthzV1Beta1Tx.MsgRevoke.encode(this.toProto()).finish()
  }
}
