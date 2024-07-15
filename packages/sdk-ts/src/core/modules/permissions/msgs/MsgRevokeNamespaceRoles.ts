import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/care-proto-ts'

export declare namespace MsgRevokeNamespaceRoles {
  export interface Params {
    sender: string;
    namespaceDenom: string;
    addressRolesToRevoke: { address: string; roles: string[] }[];
  }

  // Temporary Proto declaration
  export type Proto = {
    sender: string;
    namespaceDenom: string;
    addressRolesToRevoke: { address: string; roles: string[] }[];
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles
}

/**
 * @category Messages
 */
export default class MsgRevokeNamespaceRoles extends MsgBase<
  MsgRevokeNamespaceRoles.Params,
  MsgRevokeNamespaceRoles.Proto
> {
  static fromJSON(params: MsgRevokeNamespaceRoles.Params): MsgRevokeNamespaceRoles {
    return new MsgRevokeNamespaceRoles(params);
  }

  public toProto() {
    const { params } = this;

    const message = {
      sender: params.sender,
      namespaceDenom: params.namespaceDenom,
      addressRolesToRevoke: params.addressRolesToRevoke,
    };

    return message;
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
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgRevokeNamespaceRoles.encode()
    //   this.toProto(),
    // ).finish()
  }
}
