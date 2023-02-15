import { MsgWithdrawDelegatorReward as BaseMsgWithdrawDelegatorReward } from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgWithdrawDelegatorReward {
  export interface Params {
    delegatorAddress: string
    validatorAddress: string
  }

  export type Proto = BaseMsgWithdrawDelegatorReward

  export type Object = BaseMsgWithdrawDelegatorReward.AsObject
}

/**
 * @category Messages
 */
export default class MsgWithdrawDelegatorReward extends MsgBase<
  MsgWithdrawDelegatorReward.Params,
  MsgWithdrawDelegatorReward.Proto,
  MsgWithdrawDelegatorReward.Object
> {
  static fromJSON(
    params: MsgWithdrawDelegatorReward.Params,
  ): MsgWithdrawDelegatorReward {
    return new MsgWithdrawDelegatorReward(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgWithdrawDelegatorReward()
    message.setDelegatorAddress(params.delegatorAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      message: proto,
    }
  }
}
