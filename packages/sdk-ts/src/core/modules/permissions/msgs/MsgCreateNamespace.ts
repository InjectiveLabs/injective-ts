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
} from './../../../../client/chain/types/permissions.js'
import { GeneralException } from '@injectivelabs/exceptions'

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
    const message = snakecaseKeys({
      ...proto,
      namespace: {
        ...proto.namespace,
        policyStatuses: proto.namespace?.policyStatuses || [],
        policyManagerCapabilities:
          proto.namespace?.policyManagerCapabilities || [],
      },
    })

    return {
      type: 'permissions/MsgCreateNamespace',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgCreateNamespace',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgCreateNamespace. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()
    const namespace = web3gw.namespace as any

    const policyStatuses = (namespace?.policy_statuses || []).map(
      (policyStatus: any) => ({
        ...policyStatus,
        action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
          policyStatus.action,
        ),
      }),
    )

    const policyManagerCapabilities = (
      namespace?.policy_manager_capabilities || []
    ).map((policyManagerCapability: any) => ({
      ...policyManagerCapability,
      action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
        policyManagerCapability.action,
      ),
    }))

    const messageAdjusted = {
      ...web3gw,
      namespace: {
        denom: namespace.denom,
        contract_hook: namespace.contract_hook,
        role_permissions: namespace.role_permissions,
        actor_roles: namespace.actor_roles,
        role_managers: namespace.role_managers,
        policy_statuses: policyStatuses,
        policy_manager_capabilities: policyManagerCapabilities,
      },
    }

    return messageAdjusted
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
