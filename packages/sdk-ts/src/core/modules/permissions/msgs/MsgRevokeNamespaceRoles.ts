import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import { InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgRevokeNamespaceRoles {
  export interface Params {
    sender: string;
    namespaceDenom: string;
    addressRolesToRevoke: { address: string; roles: string[] }[];
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles
}

/**
 * @category Messages
 */
export default class MsgRevokeNamespaceRoles extends MsgBase<
  MsgRevokeNamespaceRoles.Params,
  MsgRevokeNamespaceRoles.Proto
> {
  static fromJSON(
    params: MsgRevokeNamespaceRoles.Params
  ): MsgRevokeNamespaceRoles {
    return new MsgRevokeNamespaceRoles(params);
  }

  public toProto() {
    const { params } = this;

    const message = InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles.create();

    message.sender = params.sender
    message.namespaceDenom = params.namespaceDenom
    message.addressRolesToRevoke = params.addressRolesToRevoke

    return InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgRevokeNamespaceRoles',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgRevokeNamespaceRoles',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgRevokeNamespaceRoles',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgRevokeNamespaceRoles',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles.encode(
      this.toProto(),
    ).finish()
  }
}
