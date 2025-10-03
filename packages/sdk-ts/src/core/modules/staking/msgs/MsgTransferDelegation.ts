import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  CosmosStakingV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
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

  export type Proto = CosmosStakingV1Beta1Tx.MsgTransferDelegation
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

    const coinAmount = CosmosBaseV1Beta1Coin.Coin.create()

    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = CosmosStakingV1Beta1Tx.MsgTransferDelegation.create()

    message.delegatorAddress = params.injectiveAddress
    message.validatorAddress = params.validatorAddress
    message.receiverAddress = params.receiverAddress
    message.amount = coinAmount

    return CosmosStakingV1Beta1Tx.MsgTransferDelegation.fromPartial(message)
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
      ...snakecaseKeys(proto),
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
    return CosmosStakingV1Beta1Tx.MsgTransferDelegation.encode(
      this.toProto(),
    ).finish()
  }
}
