import { MsgWithdrawValidatorCommission as BaseMsgWithdrawValidatorCommission } from '@injectivelabs/core-proto-ts/cosmos/distribution/v1beta1/tx'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgWithdrawValidatorCommission {
  export interface Params {
    validatorAddress: string
  }

  export interface DirectSign {
    type: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'
    message: BaseMsgWithdrawValidatorCommission
  }

  export interface Data extends BaseMsgWithdrawValidatorCommission {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'
  }

  export interface Amino extends BaseMsgWithdrawValidatorCommission {
    type: 'cosmos-sdk/MsgWithdrawDelegationReward'
  }

  export interface Web3 extends BaseMsgWithdrawValidatorCommission {
    '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission'
  }

  export type Proto = BaseMsgWithdrawValidatorCommission
}

/**
 * @category Messages
 */
export default class MsgWithdrawValidatorCommission extends MsgBase<
  MsgWithdrawValidatorCommission.Params,
  MsgWithdrawValidatorCommission.Data,
  MsgWithdrawValidatorCommission.Proto,
  MsgWithdrawValidatorCommission.Amino,
  MsgWithdrawValidatorCommission.DirectSign
> {
  static fromJSON(
    params: MsgWithdrawValidatorCommission.Params,
  ): MsgWithdrawValidatorCommission {
    return new MsgWithdrawValidatorCommission(params)
  }

  public toProto(): MsgWithdrawValidatorCommission.Proto {
    const { params } = this

    const message = BaseMsgWithdrawValidatorCommission.create()
    message.validatorAddress = params.validatorAddress

    return message
  }

  public toData(): MsgWithdrawValidatorCommission.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      ...proto,
    }
  }

  public toAmino(): MsgWithdrawValidatorCommission.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgWithdrawDelegationReward',
      ...proto,
    }
  }

  public toWeb3(): MsgWithdrawValidatorCommission.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      ...rest,
    }
  }

  public toDirectSign(): MsgWithdrawValidatorCommission.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgWithdrawValidatorCommission.encode(this.toProto()).finish()
  }
}
