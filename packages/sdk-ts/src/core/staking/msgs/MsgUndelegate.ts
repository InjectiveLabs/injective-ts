import { MsgUndelegate as BaseMsgUndelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgUndelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }
  export interface DirectSign {
    type: '/cosmos.staking.v1beta1.MsgUndelegate'
    message: BaseMsgUndelegate
  }

  export interface Data extends BaseMsgUndelegate.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgUndelegate'
  }

  export interface Web3 extends BaseMsgUndelegate.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgUndelegate'
  }

  export type Proto = BaseMsgUndelegate
}

export default class MsgUndelegate extends MsgBase<
  MsgUndelegate.Params,
  MsgUndelegate.Data,
  MsgUndelegate.Proto,
  MsgUndelegate.Web3,
  MsgUndelegate.DirectSign
> {
  static fromJSON(params: MsgUndelegate.Params): MsgUndelegate {
    return new MsgUndelegate(params)
  }

  toProto(): MsgUndelegate.Proto {
    const { params } = this

    const coinAmount = new Coin()
    coinAmount.setDenom(params.amount.denom)
    coinAmount.setAmount(params.amount.amount)

    const message = new BaseMsgUndelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(params.injectiveAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  toData(): MsgUndelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgUndelegate.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgUndelegate.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
      message: proto,
    }
  }
}
