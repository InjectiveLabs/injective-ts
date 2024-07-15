import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateNamespace {
  export interface Params {
    sender: string;
    denom: string;
    wasmHook: string;
    mintsPaused: boolean;
    sendsPaused: boolean;
    burnsPaused: boolean;
    rolePermissions: { role: string; permissions: number }[];
    addressRoles: { address: string; roles: string[] }[];
  }

  // Temporary Proto declaration
  export type Proto = {
    sender: string;
    namespace: {
      denom: string;
      wasmHook: string;
      mintsPaused: boolean;
      sendsPaused: boolean;
      burnsPaused: boolean;
      rolePermissions: { role: string; permissions: number }[];
      addressRoles: { address: string; roles: string[] }[];
    };
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgCreateNamespace
}

/**
 * @category Messages
 */
export default class MsgCreateNamespace extends MsgBase<
  MsgCreateNamespace.Params,
  MsgCreateNamespace.Proto
> {
  static fromJSON(params: MsgCreateNamespace.Params): MsgCreateNamespace {
    return new MsgCreateNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const namespace = {
      denom: params.denom,
      wasmHook: params.wasmHook,
      mintsPaused: params.mintsPaused,
      sendsPaused: params.sendsPaused,
      burnsPaused: params.burnsPaused,
      rolePermissions: params.rolePermissions,
      addressRoles: params.addressRoles,
    };

    const message = {
      sender: params.sender,
      namespace,
    };

    return message;
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgCreateNamespace',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgCreateNamespace',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgCreateNamespace',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgCreateNamespace',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.encode()
    //   this.toProto(),
    // ).finish()

  }
}
