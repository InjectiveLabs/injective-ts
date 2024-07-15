import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';

// future imports

// import {
//   InjectivePermissionsV1Beta1Tx
// } from '@injectivelabs/care-proto-ts'

export declare namespace MsgClaimVoucher {
  export interface Params {
    sender: string;
    originator: string;
  }

  // Temporary Proto declaration
  export type Proto = {
    sender: string;
    originator: string;
  };

  // future Proto declaration
  // export type Proto = InjectivePermissionsV1Beta1Tx.MsgClaimVoucher
}

/**
 * @category Messages
 */
export default class MsgClaimVoucher extends MsgBase<
  MsgClaimVoucher.Params,
  MsgClaimVoucher.Proto
> {
  static fromJSON(params: MsgClaimVoucher.Params): MsgClaimVoucher {
    return new MsgClaimVoucher(params);
  }

  public toProto() {
    const { params } = this;

    const message = {
      sender: params.sender,
      originator: params.originator,
    };

    return message;
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/injective.permissions.v1beta1.MsgClaimVoucher',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...snakecaseKeys(proto),
    };

    return {
      type: 'permissions/MsgClaimVoucher',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/injective.permissions.v1beta1.MsgClaimVoucher',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/injective.permissions.v1beta1.MsgClaimVoucher',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    // Placeholder for binary encoding
    return new Uint8Array();

    //// Expected binary encoding
    // return InjectivePermissionsV1Beta1Tx.MsgClaimVoucher.encode()
    //   this.toProto(),
    // ).finish()
  }
}
