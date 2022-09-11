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

  export interface Amino extends BaseMsgWithdrawDelegatorReward.AsObject {
    type: 'cosmos-sdk/MsgWithdrawDelegatorReward'
  }

  export interface Web3 extends BaseMsgWithdrawDelegatorReward.AsObject {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
  }

  export type Proto = BaseMsgWithdrawDelegatorReward
}

/**
 * @category Messages
 */
export default class MsgWithdrawDelegatorReward extends MsgBase<
  MsgWithdrawDelegatorReward.Params,
  MsgWithdrawDelegatorReward.Data,
  MsgWithdrawDelegatorReward.Proto,
  MsgWithdrawDelegatorReward.Amino,
  MsgWithdrawDelegatorReward.DirectSign
> {
  static fromJSON(
    params: MsgWithdrawDelegatorReward.Params,
  ): MsgWithdrawDelegatorReward {
    return new MsgWithdrawDelegatorReward(params)
  }

  public toProto(): MsgWithdrawDelegatorReward.Proto {
    const { params } = this

    const message = new BaseMsgWithdrawDelegatorReward()
    message.setDelegatorAddress(params.delegatorAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  public toData(): MsgWithdrawDelegatorReward.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgWithdrawDelegatorReward.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgWithdrawDelegatorReward',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgWithdrawDelegatorReward.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...rest,
    }
  }

  public toDirectSign(): MsgWithdrawDelegatorReward.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      message: proto,
    }
  }
}
