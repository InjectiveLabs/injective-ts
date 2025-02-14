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

    const namespace = InjectivePermissionsV1Beta1Permissions.Namespace.create()

    namespace.denom = params.namespace.denom
    namespace.contractHook = params.namespace.contractHook

    const rolePermissions =
      params.namespace.rolePermissions.map((rolePermission) => {
        const permission = InjectivePermissionsV1Beta1Permissions.Role.create()

        permission.name = rolePermission.name
        permission.roleId = rolePermission.roleId
        permission.permissions = rolePermission.permissions

        return permission
      }) || []

    namespace.rolePermissions = rolePermissions

    const actorRoles = params.namespace.actorRoles.map((actorRole) => {
      const role = InjectivePermissionsV1Beta1Permissions.ActorRoles.create()

      role.roles = actorRole.roles
      role.actor = actorRole.actor

      return role
    })

    namespace.actorRoles = actorRoles

    const roleManagers = params.namespace.roleManagers.map((roleManager) => {
      const role = InjectivePermissionsV1Beta1Permissions.RoleManager.create()

      role.roles = roleManager.roles
      role.manager = roleManager.manager

      return role
    })

    namespace.roleManagers = roleManagers

    const policyStatuses = params.namespace.policyStatuses.map(
      (policyStatus) => {
        const policy =
          InjectivePermissionsV1Beta1Permissions.PolicyStatus.create()

        policy.action = policyStatus.action
        policy.isDisabled = policyStatus.isDisabled
        policy.isSealed = policyStatus.isSealed

        return policy
      },
    )

    namespace.policyStatuses = policyStatuses

    const policyManagerCapabilities =
      params.namespace.policyManagerCapabilities.map(
        (policyManagerCapability) => {
          const capability =
            InjectivePermissionsV1Beta1Permissions.PolicyManagerCapability.create()

          capability.manager = policyManagerCapability.manager
          capability.action = policyManagerCapability.action
          capability.canDisable = policyManagerCapability.canDisable
          capability.canSeal = policyManagerCapability.canSeal

          return capability
        },
      )

    namespace.policyManagerCapabilities = policyManagerCapabilities

    message.namespace = namespace

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
