import * as InjectivePermissionsV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb'
import * as InjectivePermissionsV1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/params_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgUpdateParams {
  export interface Params {
    authority: string
    params: {
      wasmHookQueryMaxGas: string
      deprecatedEnforcedRestrictionsContracts?: string[]
      enforcedRestrictionsEvmContracts?: {
        contractAddress: string
        pauseEventSignature: string
        unpauseEventSignature: string
        blacklistEventSignature: string
        unblacklistEventSignature: string
      }[]
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
      deprecatedEnforcedRestrictionsContracts:
        params.params.deprecatedEnforcedRestrictionsContracts || [],
      enforcedRestrictionsEvmContracts: (
        params.params.enforcedRestrictionsEvmContracts || []
      ).map((c) =>
        InjectivePermissionsV1Beta1ParamsPb.EnforcedRestrictionsEVMContract.create(
          {
            contractAddress: c.contractAddress,
            pauseEventSignature: c.pauseEventSignature,
            unpauseEventSignature: c.unpauseEventSignature,
            blacklistEventSignature: c.blacklistEventSignature,
            unblacklistEventSignature: c.unblacklistEventSignature,
          },
        ),
      ),
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
        deprecated_enforced_restrictions_contracts:
          proto.params?.deprecatedEnforcedRestrictionsContracts || [],
        enforced_restrictions_evm_contracts: (
          proto.params?.enforcedRestrictionsEvmContracts || []
        ).map((c) => ({
          contract_address: c.contractAddress,
          pause_event_signature: c.pauseEventSignature,
          unpause_event_signature: c.unpauseEventSignature,
          blacklist_event_signature: c.blacklistEventSignature,
          unblacklist_event_signature: c.unblacklistEventSignature,
        })),
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
