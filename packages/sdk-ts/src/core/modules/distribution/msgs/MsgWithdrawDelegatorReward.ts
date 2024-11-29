import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { CosmosDistributionV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export declare namespace MsgWithdrawDelegatorReward {
  export interface Params {
    delegatorAddress: string
    validatorAddress: string
  }

  export type Proto = CosmosDistributionV1Beta1Tx.MsgWithdrawDelegatorReward
}

/**
 * @category Messages
 */
export default class MsgWithdrawDelegatorReward extends MsgBase<
  MsgWithdrawDelegatorReward.Params,
  MsgWithdrawDelegatorReward.Proto
> {
  static fromJSON(
    params: MsgWithdrawDelegatorReward.Params,
  ): MsgWithdrawDelegatorReward {
    return new MsgWithdrawDelegatorReward(params)
  }

  public toProto() {
    const { params } = this

    const message =
      CosmosDistributionV1Beta1Tx.MsgWithdrawDelegatorReward.create()

    message.delegatorAddress = params.delegatorAddress
    message.validatorAddress = params.validatorAddress

    return CosmosDistributionV1Beta1Tx.MsgWithdrawDelegatorReward.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
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

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosDistributionV1Beta1Tx.MsgWithdrawDelegatorReward.encode(
      this.toProto(),
    ).finish()
  }
}
