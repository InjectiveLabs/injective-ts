import { MsgBeginRedelegate as BaseMsgBeginRedelegate } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgBeginRedelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    srcValidatorAddress: string
    dstValidatorAddress: string
    injectiveAddress: string
  }
  export interface DirectSign {
    type: '/cosmos.staking.v1beta1.MsgBeginRedelegate'
    message: BaseMsgBeginRedelegate
  }

  export interface Data extends BaseMsgBeginRedelegate {
    '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate'
  }

  export interface Amino extends BaseMsgBeginRedelegate {
    type: 'cosmos-sdk/MsgBeginRedelegate'
  }

  export interface Web3 extends BaseMsgBeginRedelegate {
    '@type': '/cosmos.authz.v1beta1.MsgBeginRedelegate'
  }

  export type Proto = BaseMsgBeginRedelegate
}

/**
 * @category Messages
 */
export default class MsgBeginRedelegate extends MsgBase<
  MsgBeginRedelegate.Params,
  MsgBeginRedelegate.Data,
  MsgBeginRedelegate.Proto,
  MsgBeginRedelegate.Amino,
  MsgBeginRedelegate.DirectSign
> {
  static fromJSON(params: MsgBeginRedelegate.Params): MsgBeginRedelegate {
    return new MsgBeginRedelegate(params)
  }

  public toProto(): MsgBeginRedelegate.Proto {
    const { params } = this

    const coinAmount = Coin.create()
    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const message = BaseMsgBeginRedelegate.create()
    message.amount = coinAmount
    message.delegatorAddress = params.injectiveAddress
    message.validatorSrcAddress = params.srcValidatorAddress
    message.validatorDstAddress = params.dstValidatorAddress

    return BaseMsgBeginRedelegate.fromPartial(message)
  }

  public toData(): MsgBeginRedelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      ...proto,
    }
  }

  public toAmino(): MsgBeginRedelegate.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgBeginRedelegate',
      ...proto,
    }
  }

  public toWeb3(): MsgBeginRedelegate.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      ...rest,
    } as unknown as MsgBeginRedelegate.Web3
  }

  public toDirectSign(): MsgBeginRedelegate.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgBeginRedelegate.encode(this.toProto()).finish()
  }
}
