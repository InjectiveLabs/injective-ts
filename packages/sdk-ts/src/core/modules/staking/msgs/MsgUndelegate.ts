import { MsgUndelegate as BaseMsgUndelegate } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface Data extends BaseMsgUndelegate {
    '@type': '/cosmos.staking.v1beta1.MsgUndelegate'
  }

  export interface Amino extends BaseMsgUndelegate {
    type: 'cosmos-sdk/MsgUndelegate'
  }

  export interface Web3 extends BaseMsgUndelegate {
    '@type': '/cosmos.authz.v1beta1.MsgUndelegate'
  }

  export type Proto = BaseMsgUndelegate
}

/**
 * @category Messages
 */
export default class MsgUndelegate extends MsgBase<
  MsgUndelegate.Params,
  MsgUndelegate.Data,
  MsgUndelegate.Proto,
  MsgUndelegate.Amino,
  MsgUndelegate.DirectSign
> {
  static fromJSON(params: MsgUndelegate.Params): MsgUndelegate {
    return new MsgUndelegate(params)
  }

  public toProto(): MsgUndelegate.Proto {
    const { params } = this

    const coinAmount = Coin.create()
    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = BaseMsgUndelegate.create()
    message.amount = coinAmount
    message.delegatorAddress = params.injectiveAddress
    message.validatorAddress = params.validatorAddress

    return BaseMsgUndelegate.fromPartial(message)
  }

  public toData(): MsgUndelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto,
    }
  }

  public toAmino(): MsgUndelegate.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgUndelegate',
      ...proto,
    }
  }

  public toWeb3(): MsgUndelegate.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...rest,
    } as unknown as MsgUndelegate.Web3
  }

  public toDirectSign(): MsgUndelegate.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgUndelegate.encode(this.toProto()).finish()
  }
}
