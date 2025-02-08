import snakecaseKeys from 'snakecase-keys'
import {
  InjectivePermissionsV1Beta1Tx,
  InjectivePermissionsV1Beta1Permissions,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import {
  PermissionRole,
  PermissionActorRoles,
  PermissionRoleManager,
  PermissionPolicyStatus,
  PermissionPolicyManagerCapability,
} from './../../../../client/chain/types'

export declare namespace MsgCreateNamespace {
  export interface Params {
    sender: string
    namespace: {
      denom: string
      contractHook: string
      rolePermissions: PermissionRole[]
      actorRoles: PermissionActorRoles[]
      roleManagers: PermissionRoleManager[]
      policyStatuses: PermissionPolicyStatus[]
      policyManagerCapabilities: PermissionPolicyManagerCapability[]
    }
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgCreateNamespace
}

/**
 * @category Messages
 */
export default class MsgCreateNamespace extends MsgBase<
  MsgCreateNamespace.Params,
  MsgCreateNamespace.Proto
> {
  static fromJSON(params: MsgCreateNamespace.Params): MsgCreateNamespace {
    return new MsgCreateNamespace(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.create()

    message.sender = params.sender
    message.namespace = params.namespace

    return InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.permissions.v1beta1.MsgCreateNamespace',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    const policyStatuses = (proto.namespace?.policyStatuses || []).map(
      (policyStatus) => ({
        ...policyStatus,
        action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
          policyStatus.action,
        ),
      }),
    )

    const policyManagerCapabilities = (
      proto.namespace?.policyManagerCapabilities || []
    ).map((policyManagerCapability) => ({
      ...policyManagerCapability,
      action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
        policyManagerCapability.action,
      ),
    }))

    const message = snakecaseKeys({
      ...proto,
      namespace: {
        ...proto.namespace,
        policyStatuses,
        policyManagerCapabilities,
      },
    })

    return {
      type: 'permissions/MsgCreateNamespace',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgCreateNamespace',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgCreateNamespace',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.encode(
      this.toProto(),
    ).finish()
  }
}
