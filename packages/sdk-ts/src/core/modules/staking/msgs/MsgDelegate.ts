import { MsgDelegate as BaseMsgDelegate } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgDelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }

  export type Proto = BaseMsgDelegate
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

    const coinAmount = Coin.create()
    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = BaseMsgDelegate.create()
    message.amount = coinAmount
    message.delegatorAddress = params.injectiveAddress
    message.validatorAddress = params.validatorAddress

    return BaseMsgDelegate.fromPartial(message)
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

  public toWeb3() {
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
    return BaseMsgDelegate.encode(this.toProto()).finish()
  }
}
