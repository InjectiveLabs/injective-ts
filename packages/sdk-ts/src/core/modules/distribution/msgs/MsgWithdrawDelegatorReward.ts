import * as CosmosDistributionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgWithdrawDelegatorReward {
  export interface Params {
    delegatorAddress: string
    validatorAddress: string
  }

  export type Proto = CosmosDistributionV1Beta1TxPb.MsgWithdrawDelegatorReward
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
      CosmosDistributionV1Beta1TxPb.MsgWithdrawDelegatorReward.create({
        delegatorAddress: params.delegatorAddress,
        validatorAddress: params.validatorAddress,
      })

    return message
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
      delegator_address: proto.delegatorAddress,
      validator_address: proto.validatorAddress,
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
    return CosmosDistributionV1Beta1TxPb.MsgWithdrawDelegatorReward.toBinary(
      this.toProto(),
    )
  }
}
