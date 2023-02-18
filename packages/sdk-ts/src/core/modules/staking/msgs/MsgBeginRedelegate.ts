import { MsgBeginRedelegate as BaseMsgBeginRedelegate } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

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

  export type Proto = BaseMsgBeginRedelegate
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

    const coinAmount = Coin.create()
    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = BaseMsgBeginRedelegate.create()
    message.amount = coinAmount
    message.delegatorAddress = params.injectiveAddress
    message.validatorSrcAddress = params.srcValidatorAddress
    message.validatorDstAddress = params.dstValidatorAddress

    return BaseMsgBeginRedelegate.fromPartial(message)
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

  public toWeb3() {
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
    return BaseMsgBeginRedelegate.encode(this.toProto()).finish()
  }
}
