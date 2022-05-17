import { MsgDelegate as BaseMsgDelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgDelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }
  export interface DirectSign {
    type: '/cosmos.staking.v1beta1.MsgDelegate'
    message: BaseMsgDelegate
  }

  export interface Data extends BaseMsgDelegate.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgDelegate'
  }

  export interface Web3 extends BaseMsgDelegate.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgDelegate'
  }

  export type Proto = BaseMsgDelegate
}

export default class MsgDelegate extends MsgBase<
  MsgDelegate.Params,
  MsgDelegate.Data,
  MsgDelegate.Proto,
  MsgDelegate.Web3,
  MsgDelegate.DirectSign
> {
  static fromJSON(params: MsgDelegate.Params): MsgDelegate {
    return new MsgDelegate(params)
  }

  toProto(): MsgDelegate.Proto {
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

  toData(): MsgDelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgDelegate.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgDelegate.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgDelegate',
      message: proto,
    }
  }
}
