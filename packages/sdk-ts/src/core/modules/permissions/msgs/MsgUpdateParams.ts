import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/care-proto-ts'

export declare namespace MsgUpdateParams {
  export interface Params {
    authority: string;
    params: {
      wasmHookQueryMaxGas: number;
    };
  }

  // Temporary Proto declaration
  export type Proto = {
    authority: string;
    params: {
      wasmHookQueryMaxGas: number;
    };
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateParams
}

/**
 * @category Messages
 */
export default class MsgUpdateParams extends MsgBase<
  MsgUpdateParams.Params,
  MsgUpdateParams.Proto
> {
  static fromJSON(params: MsgUpdateParams.Params): MsgUpdateParams {
    return new MsgUpdateParams(params);
  }

  public toProto() {
    const { params } = this;

    const message = {
      authority: params.authority,
      params: {
        wasmHookQueryMaxGas: params.params.wasmHookQueryMaxGas,
      },
    };

    return message;
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateParams',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgUpdateParams',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateParams',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateParams',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgUpdateParams.encode()
    //   this.toProto(),
    // ).finish()
  }
}
