import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import {  InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgCreateNamespace {
  export interface Params {
    sender: string;
    namespace: {
      denom: string;
      wasmHook: string;
      mintsPaused: boolean;
      sendsPaused: boolean;
      burnsPaused: boolean;
      rolePermissions: { role: string; permissions: number }[];
      addressRoles: { address: string; roles: string[] }[];
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
  static fromJSON(
    params: MsgCreateNamespace.Params
  ): MsgCreateNamespace {
    return new MsgCreateNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const message = InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.create()

    message.sender = params.sender
    message.namespace = params.namespace

    return InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.fromPartial(
      message,
    )
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
    return InjectivePermissionsV1Beta1Tx.MsgCreateNamespace.encode(
      this.toProto(),
    ).finish()

  }
}
