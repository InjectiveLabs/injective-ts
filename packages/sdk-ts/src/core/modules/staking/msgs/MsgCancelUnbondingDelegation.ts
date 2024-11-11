import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  CosmosStakingV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

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

  export type Proto = CosmosStakingV1Beta1Tx.MsgCancelUnbondingDelegation
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

    const coinAmount = CosmosBaseV1Beta1Coin.Coin.create()

    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = CosmosStakingV1Beta1Tx.MsgCancelUnbondingDelegation.create()

    message.delegatorAddress = params.delegatorAddress
    message.validatorAddress = params.validatorAddress
    message.amount = coinAmount
    message.creationHeight = params.creationHeight

    return CosmosStakingV1Beta1Tx.MsgCancelUnbondingDelegation.fromPartial(
      message,
    )
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgCancelUnbondingDelegation',
      value: message,
    }
  }

  public toWeb3() {
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
    return CosmosStakingV1Beta1Tx.MsgCancelUnbondingDelegation.encode(
      this.toProto(),
    ).finish()
  }
}
