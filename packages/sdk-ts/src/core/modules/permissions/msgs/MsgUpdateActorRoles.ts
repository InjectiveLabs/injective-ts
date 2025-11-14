import snakecaseKeys from 'snakecase-keys'
import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb'
import * as InjectivePermissionsV1Beta1PermissionsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/permissions_pb'
import { MsgBase } from '../../MsgBase.js'
import type { PermissionRoleActors } from './../../../../client/chain/types/permissions.js'

export declare namespace MsgUpdateActorRoles {
  export interface Params {
    sender: string
    denom: string
    roleActorsToAdd: PermissionRoleActors[]
    roleActorsToRevoke: PermissionRoleActors[]
  }

  export type Proto = InjectivePermissionsV1Beta1TxPb.MsgUpdateActorRoles
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

    const roleActorsToAdd =
      params.roleActorsToAdd.map((roleActors) => {
        return InjectivePermissionsV1Beta1PermissionsPb.RoleActors.create({
          role: roleActors.role,
          actors: roleActors.actors,
        })
      }) || []

    const roleActorsToRevoke =
      params.roleActorsToRevoke.map((roleActors) => {
        return InjectivePermissionsV1Beta1PermissionsPb.RoleActors.create({
          role: roleActors.role,
          actors: roleActors.actors,
        })
      }) || []

    const message = InjectivePermissionsV1Beta1TxPb.MsgUpdateActorRoles.create({
      sender: params.sender,
      denom: params.denom,
      roleActorsToAdd: roleActorsToAdd,
      roleActorsToRevoke: roleActorsToRevoke,
    })

    return message
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

  public toWeb3Gw() {
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
    return InjectivePermissionsV1Beta1TxPb.MsgUpdateActorRoles.toBinary(
      this.toProto(),
    )
  }
}
