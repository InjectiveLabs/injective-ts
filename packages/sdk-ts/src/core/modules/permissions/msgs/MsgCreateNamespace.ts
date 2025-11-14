import snakecaseKeys from 'snakecase-keys'
import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb'
import * as InjectivePermissionsV1Beta1PermissionsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/permissions_pb'
import { MsgBase } from '../../MsgBase.js'
import type {
  PermissionRole,
  PermissionActorRoles,
  PermissionRoleManager,
  PermissionPolicyStatus,
  PermissionPolicyManagerCapability,
} from './../../../../client/chain/types/permissions.js'

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

  export type Proto = InjectivePermissionsV1Beta1TxPb.MsgCreateNamespace
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

    const rolePermissions =
      params.namespace.rolePermissions.map((rolePermission) => {
        return InjectivePermissionsV1Beta1PermissionsPb.Role.create({
          name: rolePermission.name,
          roleId: rolePermission.roleId,
          permissions: rolePermission.permissions,
        })
      }) || []

    const actorRoles = params.namespace.actorRoles.map((actorRole) => {
      return InjectivePermissionsV1Beta1PermissionsPb.ActorRoles.create({
        roles: actorRole.roles,
        actor: actorRole.actor,
      })
    })

    const roleManagers = params.namespace.roleManagers.map((roleManager) => {
      return InjectivePermissionsV1Beta1PermissionsPb.RoleManager.create({
        roles: roleManager.roles,
        manager: roleManager.manager,
      })
    })

    const policyStatuses = params.namespace.policyStatuses.map(
      (policyStatus) => {
        return InjectivePermissionsV1Beta1PermissionsPb.PolicyStatus.create({
          action: policyStatus.action,
          isDisabled: policyStatus.isDisabled,
          isSealed: policyStatus.isSealed,
        })
      },
    )

    const policyManagerCapabilities =
      params.namespace.policyManagerCapabilities.map(
        (policyManagerCapability) => {
          return InjectivePermissionsV1Beta1PermissionsPb.PolicyManagerCapability.create(
            {
              manager: policyManagerCapability.manager,
              action: policyManagerCapability.action,
              canDisable: policyManagerCapability.canDisable,
              canSeal: policyManagerCapability.canSeal,
            },
          )
        },
      )

    const namespace = InjectivePermissionsV1Beta1PermissionsPb.Namespace.create(
      {
        denom: params.namespace.denom,
        contractHook: params.namespace.contractHook,
        rolePermissions: rolePermissions,
        actorRoles: actorRoles,
        roleManagers: roleManagers,
        policyStatuses: policyStatuses,
        policyManagerCapabilities: policyManagerCapabilities,
      },
    )

    const message = InjectivePermissionsV1Beta1TxPb.MsgCreateNamespace.create({
      sender: params.sender,
      namespace: namespace,
    })

    return message
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
        action:
          InjectivePermissionsV1Beta1PermissionsPb.Action[policyStatus.action],
      }),
    )

    const policyManagerCapabilities = (
      namespace?.policy_manager_capabilities || []
    ).map((policyManagerCapability: any) => ({
      ...policyManagerCapability,
      action:
        InjectivePermissionsV1Beta1PermissionsPb.Action[
          policyManagerCapability.action
        ],
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
    return InjectivePermissionsV1Beta1TxPb.MsgCreateNamespace.toBinary(
      this.toProto(),
    )
  }
}
