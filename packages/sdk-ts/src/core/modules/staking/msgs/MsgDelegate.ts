import { MsgDelegate as BaseMsgDelegate } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
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

  export interface Data extends BaseMsgDelegate {
    '@type': '/cosmos.staking.v1beta1.MsgDelegate'
  }

  export interface Amino extends BaseMsgDelegate {
    type: 'cosmos-sdk/MsgDelegate'
  }

  export interface Web3 extends BaseMsgDelegate {
    '@type': '/cosmos.authz.v1beta1.MsgDelegate'
  }

  export type Proto = BaseMsgDelegate
}

/**
 * @category Messages
 */
export default class MsgDelegate extends MsgBase<
  MsgDelegate.Params,
  MsgDelegate.Data,
  MsgDelegate.Proto,
  MsgDelegate.Amino,
  MsgDelegate.DirectSign
> {
  static fromJSON(params: MsgDelegate.Params): MsgDelegate {
    return new MsgDelegate(params)
  }

  public toProto(): MsgDelegate.Proto {
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

  public toData(): MsgDelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...proto,
    }
  }

  public toAmino(): MsgDelegate.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgDelegate',
      ...proto,
    }
  }

  public toWeb3(): MsgDelegate.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgDelegate',
      ...rest,
    } as unknown as MsgDelegate.Web3
  }

  public toDirectSign(): MsgDelegate.DirectSign {
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
