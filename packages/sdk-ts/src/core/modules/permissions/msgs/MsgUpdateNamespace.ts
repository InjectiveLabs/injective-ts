import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/care-proto-ts'

export declare namespace MsgUpdateNamespace {
  export interface Params {
    sender: string;
    namespaceDenom: string;
    wasmHook: string;
    mintsPaused: boolean;
    sendsPaused: boolean;
    burnsPaused: boolean;
  }

  // Temporary Proto declaration
  export type Proto = {
    sender: string;
    namespaceDenom: string;
    wasmHook: {
      newValue: string;
    };
    mintsPaused: {
      newValue: boolean;
    };
    sendsPaused: {
      newValue: boolean;
    };
    burnsPaused: {
      newValue: boolean;
    };
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace
}

/**
 * @category Messages
 */
export default class MsgUpdateNamespace extends MsgBase<
  MsgUpdateNamespace.Params,
  MsgUpdateNamespace.Proto
> {
  static fromJSON(params: MsgUpdateNamespace.Params): MsgUpdateNamespace {
    return new MsgUpdateNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const message = {
      sender: params.sender,
      namespaceDenom: params.namespaceDenom,
      wasmHook: {
        newValue: params.wasmHook,
      },
      mintsPaused: {
        newValue: params.mintsPaused,
      },
      sendsPaused: {
        newValue: params.sendsPaused,
      },
      burnsPaused: {
        newValue: params.burnsPaused,
      },
    };

    return message;
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespace',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgUpdateNamespace',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateNamespace',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateNamespace',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.encode()
    //   this.toProto(),
    // ).finish()
  }
}
