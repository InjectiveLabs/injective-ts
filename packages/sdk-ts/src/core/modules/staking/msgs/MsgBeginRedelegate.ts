import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  CosmosStakingV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgBeginRedelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    srcValidatorAddress: string
    dstValidatorAddress: string
    injectiveAddress: string
  }

  export type Proto = CosmosStakingV1Beta1Tx.MsgBeginRedelegate
}

/**
 * @category Messages
 */
export default class MsgBeginRedelegate extends MsgBase<
  MsgBeginRedelegate.Params,
  MsgBeginRedelegate.Proto
> {
  static fromJSON(params: MsgBeginRedelegate.Params): MsgBeginRedelegate {
    return new MsgBeginRedelegate(params)
  }

  public toProto(): MsgBeginRedelegate.Proto {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1Coin.Coin.create()

    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = CosmosStakingV1Beta1Tx.MsgBeginRedelegate.create()

    message.delegatorAddress = params.injectiveAddress
    message.validatorSrcAddress = params.srcValidatorAddress
    message.validatorDstAddress = params.dstValidatorAddress
    message.amount = coinAmount

    return CosmosStakingV1Beta1Tx.MsgBeginRedelegate.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgBeginRedelegate',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1Tx.MsgBeginRedelegate.encode(
      this.toProto(),
    ).finish()
  }
}
