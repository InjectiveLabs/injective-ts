import snakecaseKeys from 'snakecase-keys'
import {
  InjectivePermissionsV1Beta1Tx,
  InjectivePermissionsV1Beta1Permissions,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import {
  PermissionRole,
  PermissionRoleManager,
  PermissionPolicyStatus,
  PermissionPolicyManagerCapability,
} from './../../../../client/chain/types'

export declare namespace MsgUpdateNamespace {
  export interface Params {
    sender: string
    denom: string
    contractHook?: string
    rolePermissions: PermissionRole[]
    roleManagers: PermissionRoleManager[]
    policyStatuses: PermissionPolicyStatus[]
    policyManagerCapabilities: PermissionPolicyManagerCapability[]
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace
}

/**
 * @category Messages
 */
export default class MsgUpdateNamespace extends MsgBase<
  MsgUpdateNamespace.Params,
  MsgUpdateNamespace.Proto
> {
  static fromJSON(params: MsgUpdateNamespace.Params): MsgUpdateNamespace {
    return new MsgUpdateNamespace(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.create()
    message.sender = params.sender
    message.denom = params.denom
    message.rolePermissions = params.rolePermissions
    message.roleManagers = params.roleManagers
    message.policyStatuses = params.policyStatuses
    message.policyManagerCapabilities = params.policyManagerCapabilities

    if (params.contractHook) {
      const contractHook =
        InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace_SetContractHook.create()
      contractHook.newValue = params.contractHook

      message.contractHook = contractHook
    }

    const permissions =
      params.rolePermissions.map((rolePermission) => {
        const permission = InjectivePermissionsV1Beta1Permissions.Role.create()

        permission.name = rolePermission.name
        permission.permissions = rolePermission.permissions
        permission.roleId = rolePermission.roleId

        return permission
      }) || []

    message.rolePermissions = permissions

    const roleManagers =
      params.roleManagers.map((roleManager) => {
        const manager =
          InjectivePermissionsV1Beta1Permissions.RoleManager.create()

        manager.roles = roleManager.roles
        manager.manager = roleManager.manager

        return manager
      }) || []

    message.roleManagers = roleManagers

    const policyStatuses =
      params.policyStatuses.map((policyStatus) => {
        const policy =
          InjectivePermissionsV1Beta1Permissions.PolicyStatus.create()

        policy.action = policyStatus.action
        policy.isDisabled = policyStatus.isDisabled
        policy.isSealed = policyStatus.isSealed

        return policy
      }) || []

    message.policyStatuses = policyStatuses

    const policyManagerCapabilities =
      params.policyManagerCapabilities.map((capability) => {
        const policy =
          InjectivePermissionsV1Beta1Permissions.PolicyManagerCapability.create()

        policy.action = capability.action
        policy.canDisable = capability.canDisable
        policy.canSeal = capability.canSeal
        policy.manager = capability.manager

        return policy
      }) || []

    message.policyManagerCapabilities = policyManagerCapabilities

    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespace',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    const policyStatuses =
      proto.policyStatuses.map((policyStatus) => ({
        ...policyStatus,
        action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
          policyStatus.action,
        ),
      })) || []

    const policyManagerCapabilities =
      proto.policyManagerCapabilities.map((policyManagerCapability) => ({
        ...policyManagerCapability,
        action: InjectivePermissionsV1Beta1Permissions.actionToJSON(
          policyManagerCapability.action,
        ),
      })) || []

    const message = snakecaseKeys({
      ...proto,
      policyStatuses,
      policyManagerCapabilities,
    })

    return {
      type: 'permissions/MsgUpdateNamespace',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespace',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateNamespace',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.encode(
      this.toProto(),
    ).finish()
  }
}
