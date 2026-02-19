import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb'
import * as InjectivePermissionsV1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/params_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgUpdateParams {
  export interface Params {
    authority: string
    params: {
      wasmHookQueryMaxGas: string
      enforcedRestrictionsContracts?: string[]
    }
  }

  export type Proto = InjectivePermissionsV1Beta1TxPb.MsgUpdateParams
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

    const messageParams = InjectivePermissionsV1Beta1ParamsPb.Params.create({
      contractHookMaxGas: BigInt(params.params.wasmHookQueryMaxGas),
    })

    const message = InjectivePermissionsV1Beta1TxPb.MsgUpdateParams.create({
      authority: params.authority,
      params: messageParams,
    })

    return message
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
      authority: proto.authority,
      params: {
        contract_hook_max_gas:
          proto.params?.contractHookMaxGas.toString() || '0',
      },
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
      params: {
        ...value.params,
        enforced_restrictions_contracts:
          this.params.params.enforcedRestrictionsContracts || [],
      },
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
    return InjectivePermissionsV1Beta1TxPb.MsgUpdateParams.toBinary(
      this.toProto(),
    )
  }
}
