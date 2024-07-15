import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/care-proto-ts'

export declare namespace MsgDeleteNamespace {
  export interface Params {
    sender: string;
    namespaceDenom: string;
  }

  // Temporary Proto declaration
  export type Proto = {
    sender: string;
    namespaceDenom: string;
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace
}

/**
 * @category Messages
 */
export default class MsgDeleteNamespace extends MsgBase<
  MsgDeleteNamespace.Params,
  MsgDeleteNamespace.Proto
> {
  static fromJSON(params: MsgDeleteNamespace.Params): MsgDeleteNamespace {
    return new MsgDeleteNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const message = {
      sender: params.sender,
      namespaceDenom: params.namespaceDenom,
    };

    return message;
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgDeleteNamespace',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgDeleteNamespace',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgDeleteNamespace',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgDeleteNamespace',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace.encode()
    //   this.toProto(),
    // ).finish()
  }
}
