import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCancelUnbondingDelegation {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    delegatorAddress: string
    creationHeight: string
  }

  export type Proto = CosmosStakingV1Beta1TxPb.MsgCancelUnbondingDelegation
}

/**
 * @category Messages
 */
export default class MsgCancelUnbondingDelegation extends MsgBase<
  MsgCancelUnbondingDelegation.Params,
  MsgCancelUnbondingDelegation.Proto
> {
  static fromJSON(
    params: MsgCancelUnbondingDelegation.Params,
  ): MsgCancelUnbondingDelegation {
    return new MsgCancelUnbondingDelegation(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message =
      CosmosStakingV1Beta1TxPb.MsgCancelUnbondingDelegation.create({
        delegatorAddress: params.delegatorAddress,
        validatorAddress: params.validatorAddress,
        amount: coinAmount,
        creationHeight: BigInt(params.creationHeight),
      })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      delegator_address: proto.delegatorAddress,
      validator_address: proto.validatorAddress,
      amount: proto.amount,
      creation_height: proto.creationHeight?.toString(),
    }

    return {
      type: 'cosmos-sdk/MsgCancelUnbondingDelegation',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgCancelUnbondingDelegation.toBinary(
      this.toProto(),
    )
  }
}
