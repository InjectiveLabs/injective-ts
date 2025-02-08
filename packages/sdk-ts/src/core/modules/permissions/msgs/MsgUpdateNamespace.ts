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
      message.contractHook = { newValue: params.contractHook }
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
