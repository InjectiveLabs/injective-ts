import snakecaseKeys from 'snakecase-keys'
import { InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import { PermissionRoleActors } from './../../../../client/chain/types'

export declare namespace MsgUpdateActorRoles {
  export interface Params {
    sender: string
    denom: string
    roleActorsToAdd: PermissionRoleActors[]
    roleActorsToRevoke: PermissionRoleActors[]
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateActorRoles
}

/**
 * @category Messages
 */
export default class MsgUpdateActorRoles extends MsgBase<
  MsgUpdateActorRoles.Params,
  MsgUpdateActorRoles.Proto
> {
  static fromJSON(params: MsgUpdateActorRoles.Params): MsgUpdateActorRoles {
    return new MsgUpdateActorRoles(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1Tx.MsgUpdateActorRoles.create()
    message.sender = params.sender
    message.denom = params.denom
    message.roleActorsToAdd = params.roleActorsToAdd
    message.roleActorsToRevoke = params.roleActorsToRevoke

    return InjectivePermissionsV1Beta1Tx.MsgUpdateActorRoles.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateActorRoles',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'permissions/MsgUpdateActorRoles',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateActorRoles',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateActorRoles',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgUpdateActorRoles.encode(
      this.toProto(),
    ).finish()
  }
}
