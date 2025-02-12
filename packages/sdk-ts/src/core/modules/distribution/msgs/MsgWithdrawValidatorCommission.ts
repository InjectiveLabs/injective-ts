import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { CosmosDistributionV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgWithdrawValidatorCommission {
  export interface Params {
    validatorAddress: string
  }

  export type Proto = CosmosDistributionV1Beta1Tx.MsgWithdrawValidatorCommission
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
      CosmosDistributionV1Beta1Tx.MsgWithdrawValidatorCommission.create()

    message.validatorAddress = params.validatorAddress

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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
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
    return CosmosDistributionV1Beta1Tx.MsgWithdrawValidatorCommission.encode(
      this.toProto(),
    ).finish()
  }
}
