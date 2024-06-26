import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { CosmosFeegrantV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgRevokeAllowance {
  export interface Params {
    granter: string
    grantee: string
  }

  export type Proto = CosmosFeegrantV1Beta1Tx.MsgRevokeAllowance
}

/**
 * @category Messages
 */
export default class MsgRevokeAllowance extends MsgBase<
  MsgRevokeAllowance.Params,
  MsgRevokeAllowance.Proto
> {
  static fromJSON(params: MsgRevokeAllowance.Params): MsgRevokeAllowance {
    return new MsgRevokeAllowance(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosFeegrantV1Beta1Tx.MsgRevokeAllowance.create()

    message.granter = params.granter
    message.grantee = params.grantee

    return CosmosFeegrantV1Beta1Tx.MsgRevokeAllowance.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgRevokeAllowance',
      value: message as unknown as SnakeCaseKeys<MsgRevokeAllowance>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosFeegrantV1Beta1Tx.MsgRevokeAllowance.encode(
      this.toProto(),
    ).finish()
  }
}
