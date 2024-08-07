import { MsgBase } from '../../MsgBase';
import snakecaseKeys from 'snakecase-keys';
import { InjectivePermissionsV1Beta1Tx } from '@injectivelabs/core-proto-ts';

export declare namespace MsgClaimVoucher {
  export interface Params {
    sender: string
    denom: string
  }


  export type Proto = InjectivePermissionsV1Beta1Tx.MsgClaimVoucher
}

/**
 * @category Messages
 */
export default class MsgClaimVoucher extends MsgBase<
  MsgClaimVoucher.Params,
  MsgClaimVoucher.Proto
> {
  static fromJSON(
    params: MsgClaimVoucher.Params,
  ): MsgClaimVoucher {
    return new MsgClaimVoucher(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1Tx.MsgClaimVoucher.create()
    message.sender = params.sender
    message.denom = params.denom

    return InjectivePermissionsV1Beta1Tx.MsgClaimVoucher.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.permissions.v1beta1.MsgClaimVoucher',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'permissions/MsgClaimVoucher',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgClaimVoucher',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgClaimVoucher',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgClaimVoucher.encode(
      this.toProto(),
    ).finish()
  }
}
