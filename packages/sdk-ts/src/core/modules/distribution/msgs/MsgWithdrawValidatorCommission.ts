import * as CosmosDistributionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgWithdrawValidatorCommission {
  export interface Params {
    validatorAddress: string
  }

  export type Proto =
    CosmosDistributionV1Beta1TxPb.MsgWithdrawValidatorCommission
}

/**
 * @category Messages
 */
export default class MsgWithdrawValidatorCommission extends MsgBase<
  MsgWithdrawValidatorCommission.Params,
  MsgWithdrawValidatorCommission.Proto
> {
  static fromJSON(
    params: MsgWithdrawValidatorCommission.Params,
  ): MsgWithdrawValidatorCommission {
    return new MsgWithdrawValidatorCommission(params)
  }

  public toProto() {
    const { params } = this

    const message =
      CosmosDistributionV1Beta1TxPb.MsgWithdrawValidatorCommission.create({
        validatorAddress: params.validatorAddress,
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      validator_address: proto.validatorAddress,
    }

    return {
      type: 'cosmos-sdk/MsgWithdrawValCommission',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosDistributionV1Beta1TxPb.MsgWithdrawValidatorCommission.toBinary(
      this.toProto(),
    )
  }
}
