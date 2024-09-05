import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import { InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgUpdateNamespaceRoles {
  export interface Params {
    sender: string;
    namespaceDenom: string;
    rolePermissions: { role: string; permissions: number }[];
    addressRoles: { address: string; roles: string[] }[];
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespaceRoles
}

/**
 * @category Messages
 */
export default class MsgUpdateNamespaceRoles extends MsgBase<
  MsgUpdateNamespaceRoles.Params,
  MsgUpdateNamespaceRoles.Proto
> {
  static fromJSON(
    params: MsgUpdateNamespaceRoles.Params
  ): MsgUpdateNamespaceRoles {
    return new MsgUpdateNamespaceRoles(params);
  }

  public toProto() {
    const { params } = this;

    const message = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespaceRoles.create();

    message.sender = params.sender
    message.namespaceDenom = params.namespaceDenom
    message.rolePermissions = params.rolePermissions
    message.addressRoles = params.addressRoles

    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespaceRoles.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespaceRoles',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgUpdateNamespaceRoles',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespaceRoles',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateNamespaceRoles',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespaceRoles.encode(
      this.toProto(),
    ).finish()
  }
}
