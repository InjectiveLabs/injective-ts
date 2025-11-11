import snakecaseKeys from 'snakecase-keys'
import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb.mjs'
import * as InjectivePermissionsV1Beta1PermissionsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/permissions_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import type {
  PermissionRole,
  PermissionRoleManager,
  PermissionPolicyStatus,
  PermissionPolicyManagerCapability,
} from './../../../../client/chain/types/permissions.js'

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

  export type Proto = InjectivePermissionsV1Beta1TxPb.MsgUpdateNamespace
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

    const contractHook = params.contractHook
      ? InjectivePermissionsV1Beta1TxPb.MsgUpdateNamespace_SetContractHook.create(
          {
            newValue: params.contractHook,
          },
        )
      : undefined

    const permissions = params.rolePermissions.map((rolePermission) => {
      return InjectivePermissionsV1Beta1PermissionsPb.Role.create({
        name: rolePermission.name,
        permissions: rolePermission.permissions,
        roleId: rolePermission.roleId,
      })
    })

    const roleManagers = params.roleManagers.map((roleManager) => {
      return InjectivePermissionsV1Beta1PermissionsPb.RoleManager.create({
        roles: roleManager.roles,
        manager: roleManager.manager,
      })
    })

    const policyStatuses = params.policyStatuses.map((policyStatus) => {
      return InjectivePermissionsV1Beta1PermissionsPb.PolicyStatus.create({
        action: policyStatus.action,
        isDisabled: policyStatus.isDisabled,
        isSealed: policyStatus.isSealed,
      })
    })

    const policyManagerCapabilities = params.policyManagerCapabilities.map(
      (capability) => {
        return InjectivePermissionsV1Beta1PermissionsPb.PolicyManagerCapability.create(
          {
            action: capability.action,
            canDisable: capability.canDisable,
            canSeal: capability.canSeal,
            manager: capability.manager,
          },
        )
      },
    )

    const message = InjectivePermissionsV1Beta1TxPb.MsgUpdateNamespace.create({
      sender: params.sender,
      denom: params.denom,
      contractHook: contractHook,
      rolePermissions: permissions,
      roleManagers: roleManagers,
      policyStatuses: policyStatuses,
      policyManagerCapabilities: policyManagerCapabilities,
    })

    return message
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

    const message = snakecaseKeys({
      ...proto,
      policyStatuses: proto.policyStatuses || [],
      policyManagerCapabilities: proto.policyManagerCapabilities || [],
    })

    return {
      type: 'permissions/MsgUpdateNamespace',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespace',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgUpdateNamespace. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()

    const policyStatuses = (web3gw.policy_statuses || []).map(
      (policyStatus: any) => ({
        ...policyStatus,
        action:
          InjectivePermissionsV1Beta1PermissionsPb.Action[policyStatus.action],
      }),
    )

    const policyManagerCapabilities = (
      web3gw.policy_manager_capabilities || []
    ).map((policyManagerCapability: any) => ({
      ...policyManagerCapability,
      action:
        InjectivePermissionsV1Beta1PermissionsPb.Action[
          policyManagerCapability.action
        ],
    }))

    const messageAdjusted = {
      ...web3gw,
      policy_statuses: policyStatuses,
      policy_manager_capabilities: policyManagerCapabilities,
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateNamespace',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1TxPb.MsgUpdateNamespace.toBinary(
      this.toProto(),
    )
  }
}
