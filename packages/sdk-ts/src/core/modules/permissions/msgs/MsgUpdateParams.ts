import {
  InjectivePermissionsV1Beta1Tx,
  InjectivePermissionsV1Beta1Params,
} from '@injectivelabs/core-proto-ts'
import snakecaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase.js'
export declare namespace MsgUpdateParams {
  export interface Params {
    authority: string
    params: {
      wasmHookQueryMaxGas: string
    }
  }

  export type Proto = InjectivePermissionsV1Beta1Tx.MsgUpdateParams
}

/**
 * @category Messages
 */
export default class MsgUpdateParams extends MsgBase<
  MsgUpdateParams.Params,
  MsgUpdateParams.Proto
> {
  static fromJSON(params: MsgUpdateParams.Params): MsgUpdateParams {
    return new MsgUpdateParams(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectivePermissionsV1Beta1Tx.MsgUpdateParams.create()
    message.authority = params.authority
    message.params = params.params

    const messageParams = InjectivePermissionsV1Beta1Params.Params.create()
    messageParams.wasmHookQueryMaxGas = params.params.wasmHookQueryMaxGas

    message.params = messageParams

    return InjectivePermissionsV1Beta1Tx.MsgUpdateParams.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateParams',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'permissions/MsgUpdateParams',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.permissions.v1beta1.MsgUpdateParams',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.permissions.v1beta1.MsgUpdateParams',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectivePermissionsV1Beta1Tx.MsgUpdateParams.encode(
      this.toProto(),
    ).finish()
  }
}
