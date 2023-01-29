import { MsgWithdrawDelegatorReward as BaseMsgWithdrawDelegatorReward } from '@injectivelabs/core-proto-ts/cosmos/distribution/v1beta1/tx'
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

  export interface Data extends BaseMsgWithdrawDelegatorReward {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
  }

  export interface Amino extends BaseMsgWithdrawDelegatorReward {
    type: 'cosmos-sdk/MsgWithdrawDelegationReward'
  }

  export interface Web3 extends BaseMsgWithdrawDelegatorReward {
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

    const message = BaseMsgWithdrawDelegatorReward.create()
    message.delegatorAddress = params.delegatorAddress
    message.validatorAddress = params.validatorAddress

    return BaseMsgWithdrawDelegatorReward.fromPartial(message)
  }

  public toData(): MsgWithdrawDelegatorReward.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...proto,
    }
  }

  public toAmino(): MsgWithdrawDelegatorReward.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      ...proto,
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

  public toBinary(): Uint8Array {
    return BaseMsgWithdrawDelegatorReward.encode(this.toProto()).finish()
  }
}
