import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import { InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts';

export declare namespace MsgUpdateNamespace {
  export interface Params {
    sender: string;
    namespaceDenom: string;
    wasmHook: {
      newValue: string;
    }
    mintsPaused: {
      newValue: boolean;
    }
    sendsPaused: {
      newValue: boolean;
    }
    burnsPaused: {
      newValue: boolean;
    }
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace
}

/**
 * @category Messages
 */
export default class MsgUpdateNamespace extends MsgBase<
  MsgUpdateNamespace.Params,
  MsgUpdateNamespace.Proto
> {
  static fromJSON(
    params: MsgUpdateNamespace.Params
  ): MsgUpdateNamespace {
    return new MsgUpdateNamespace(params);
  }

  public toProto() {
    const { params } = this;

    const message = InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.create()
    message.sender = params.sender
    message.namespaceDenom = params.namespaceDenom
    message.wasmHook = {
      newValue: params.wasmHook.newValue,
    }
    message.mintsPaused = {
      newValue: params.mintsPaused.newValue,
    }
    message.sendsPaused =  {
      newValue: params.sendsPaused.newValue,
    }
    message.burnsPaused = {
        newValue: params.burnsPaused.newValue,
    }

    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.fromPartial(
      message,
    )
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
    return InjectivePermissionsV1Beta1Tx.MsgUpdateNamespace.encode(
      this.toProto(),
    ).finish()
  }
}
