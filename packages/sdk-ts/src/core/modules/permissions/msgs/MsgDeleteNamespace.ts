import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import {  InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts';

export declare namespace MsgDeleteNamespace {
  export interface Params {
    sender: string;
    namespaceDenom: string;
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace
}

/**
 * @category Messages
 */
export default class MsgDeleteNamespace extends MsgBase<
  MsgDeleteNamespace.Params,
  MsgDeleteNamespace.Proto
> {
  static fromJSON(
    params: MsgDeleteNamespace.Params
  ): MsgDeleteNamespace {
    return new MsgDeleteNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const message = InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace.create()

    message.sender = params.sender
    message.namespaceDenom = params.namespaceDenom

    return InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace.fromPartial(
      message,
    )
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
    return InjectivePermissionsV1Beta1Tx.MsgDeleteNamespace.encode(
      this.toProto(),
    ).finish()
  }
}
