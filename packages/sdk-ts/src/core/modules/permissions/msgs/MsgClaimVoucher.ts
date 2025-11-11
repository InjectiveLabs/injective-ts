import snakecaseKeys from 'snakecase-keys'
import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgClaimVoucher {
  export interface Params {
    sender: string
    denom: string
  }

  export type Proto = InjectivePermissionsV1Beta1TxPb.MsgClaimVoucher
}

/**
 * @category Messages
 */
export default class MsgClaimVoucher extends MsgBase<
  MsgClaimVoucher.Params,
  MsgClaimVoucher.Proto
> {
  static fromJSON(params: MsgClaimVoucher.Params): MsgClaimVoucher {
    return new MsgClaimVoucher(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1TxPb.MsgClaimVoucher.create({
      sender: params.sender,
      denom: params.denom,
    })

    return message
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

  public toWeb3Gw() {
    const amino = this.toAmino()
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
    return InjectivePermissionsV1Beta1TxPb.MsgClaimVoucher.toBinary(
      this.toProto(),
    )
  }
}
