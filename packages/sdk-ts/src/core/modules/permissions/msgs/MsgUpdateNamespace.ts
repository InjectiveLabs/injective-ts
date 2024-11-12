import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  InjectivePermissionsV1Beta1Tx,
  InjectivePermissionsV1Beta1Permissions,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgUpdateNamespace {
  export interface Params {
    sender: string
    namespace: Partial<InjectivePermissionsV1Beta1Permissions.Namespace>
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

    if (params.namespace.contractHook) {
      const contractHook =
        InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace_SetContractHook.create()
      contractHook.newValue = params.namespace.contractHook

      message.contractHook = contractHook
    }

    if (params.namespace.roleManagers) {
      const roleManagers = params.namespace.roleManagers.map((roleManager) => {
        const manager =
          InjectivePermissionsV1Beta1Permissions.RoleManager.create()

        manager.roles = roleManager.roles
        manager.manager = roleManager.manager

        return manager
      })

      message.roleManagers = roleManagers
    }

    if (params.namespace.rolePermissions) {
      const permissions = params.namespace.rolePermissions.map(
        (rolePermission) => {
          const permission =
            InjectivePermissionsV1Beta1Permissions.Role.create()

          permission.name = rolePermission.name
          permission.permissions = rolePermission.permissions
          permission.roleId = rolePermission.roleId

          return permission
        },
      )

      message.rolePermissions = permissions
    }

    //     /** policy statuses to update */
    // policyStatuses: PolicyStatus[];
    // /** policy manager capabilities to update */
    // policyManagerCapabilities: PolicyManagerCapability[];

    if (params.namespace.policyStatuses) {
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

      message.policyStatuses = policyStatuses
    }

    if (params.namespace.policyManagerCapabilities) {
      const policyManagerCapabilities =
        params.namespace.policyManagerCapabilities.map((capability) => {
          const policy =
            InjectivePermissionsV1Beta1Permissions.PolicyManagerCapability.create()

          policy.action = capability.action
          policy.canDisable = capability.canDisable
          policy.canSeal = capability.canSeal
          policy.manager = capability.manager

          return policy
        })

      message.policyManagerCapabilities = policyManagerCapabilities
    }

    if (params.namespace.denom) {
      message.denom = params.namespace.denom
    }

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
    const message = {
      ...snakecaseKeys(proto),
    }

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
