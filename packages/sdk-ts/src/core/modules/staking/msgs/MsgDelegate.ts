import snakecaseKeys from 'snakecase-keys'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgDelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }

  export type Proto = CosmosStakingV1Beta1TxPb.MsgDelegate
}

/**
 * @category Messages
 */
export default class MsgDelegate extends MsgBase<
  MsgDelegate.Params,
  MsgDelegate.Proto
> {
  static fromJSON(params: MsgDelegate.Params): MsgDelegate {
    return new MsgDelegate(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = CosmosStakingV1Beta1TxPb.MsgDelegate.create({
      delegatorAddress: params.injectiveAddress,
      validatorAddress: params.validatorAddress,
      amount: coinAmount,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgDelegate',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgDelegate',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgDelegate.toBinary(this.toProto())
  }
}
