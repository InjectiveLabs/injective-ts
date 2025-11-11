import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgTransferDelegation {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    injectiveAddress: string
    validatorAddress: string
    receiverAddress: string
  }

  export type Proto = CosmosStakingV1Beta1TxPb.MsgTransferDelegation
}

/**
 * @category Messages
 */
export default class MsgTransferDelegation extends MsgBase<
  MsgTransferDelegation.Params,
  MsgTransferDelegation.Proto
> {
  static fromJSON(params: MsgTransferDelegation.Params): MsgTransferDelegation {
    return new MsgTransferDelegation(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = CosmosStakingV1Beta1TxPb.MsgTransferDelegation.create({
      delegatorAddress: params.injectiveAddress,
      validatorAddress: params.validatorAddress,
      receiverAddress: params.receiverAddress,
      amount: coinAmount,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgTransferDelegation',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      delegator_address: proto.delegatorAddress,
      validator_address: proto.validatorAddress,
      receiver_address: proto.receiverAddress,
      amount: proto.amount,
    }

    return {
      type: 'cosmos-sdk/MsgTransferDelegation',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgTransferDelegation',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgTransferDelegation',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgTransferDelegation.toBinary(
      this.toProto(),
    )
  }
}
