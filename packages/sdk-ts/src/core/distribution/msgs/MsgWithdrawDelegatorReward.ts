import { MsgWithdrawDelegatorReward as BaseMsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgWithdrawDelegatorReward {
  export interface Params {
    delegatorAddress: string
    validatorAddress: string
  }

  export interface DirectSign {
    type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
    message: BaseMsgWithdrawDelegatorReward
  }

  export interface Data extends BaseMsgWithdrawDelegatorReward.AsObject {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
  }

  export interface Web3 extends BaseMsgWithdrawDelegatorReward.AsObject {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
  }

  export type Proto = BaseMsgWithdrawDelegatorReward
}

export default class MsgWithdrawDelegatorReward extends MsgBase<
  MsgWithdrawDelegatorReward.Params,
  MsgWithdrawDelegatorReward.Data,
  MsgWithdrawDelegatorReward.Proto,
  MsgWithdrawDelegatorReward.Web3,
  MsgWithdrawDelegatorReward.DirectSign
> {
  static fromJSON(
    params: MsgWithdrawDelegatorReward.Params,
  ): MsgWithdrawDelegatorReward {
    return new MsgWithdrawDelegatorReward(params)
  }

  toProto(): MsgWithdrawDelegatorReward.Proto {
    const { params } = this

    const message = new BaseMsgWithdrawDelegatorReward()
    message.setDelegatorAddress(params.delegatorAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  toData(): MsgWithdrawDelegatorReward.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgWithdrawDelegatorReward.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgWithdrawDelegatorReward.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      message: proto,
    }
  }
}
