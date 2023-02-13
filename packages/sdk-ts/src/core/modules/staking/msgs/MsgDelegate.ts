import { MsgDelegate as BaseMsgDelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  export type Object = BaseMsgDelegate.AsObject
}

/**
 * @category Messages
 */
export default class MsgDelegate extends MsgBase<
  MsgDelegate.Params,
  MsgDelegate.Proto,
  MsgDelegate.Object
> {
  static fromJSON(params: MsgDelegate.Params): MsgDelegate {
    return new MsgDelegate(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = new Coin()
    coinAmount.setDenom(params.amount.denom)
    coinAmount.setAmount(params.amount.amount)

    const message = new BaseMsgDelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(params.injectiveAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
