import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgUndelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }

  export type Proto = CosmosStakingV1Beta1TxPb.MsgUndelegate
}

/**
 * @category Messages
 */
export default class MsgUndelegate extends MsgBase<
  MsgUndelegate.Params,
  MsgUndelegate.Proto
> {
  static fromJSON(params: MsgUndelegate.Params): MsgUndelegate {
    return new MsgUndelegate(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = CosmosStakingV1Beta1TxPb.MsgUndelegate.create({
      delegatorAddress: params.injectiveAddress,
      validatorAddress: params.validatorAddress,
      amount: coinAmount,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      delegator_address: proto.delegatorAddress,
      validator_address: proto.validatorAddress,
      amount: proto.amount,
    }

    return {
      type: 'cosmos-sdk/MsgUndelegate',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgUndelegate.toBinary(this.toProto())
  }
}
