import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgSend as BaseMsgSend } from '@injectivelabs/core-proto-ts/cosmos/bank/v1beta1/tx'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgSend {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    srcInjectiveAddress: string
    dstInjectiveAddress: string
  }

  export interface DirectSign {
    type: '/cosmos.bank.v1beta1.MsgSend'
    message: BaseMsgSend
  }

  export interface Data extends BaseMsgSend {
    '@type': '/cosmos.bank.v1beta1.MsgSend'
  }

  export interface Amino extends BaseMsgSend {
    type: 'cosmos-sdk/MsgSend'
  }

  export interface Web3 extends BaseMsgSend {
    '@type': '/cosmos.bank.v1beta1.MsgSend'
  }

  export type Proto = BaseMsgSend
}

/**
 * @category Messages
 */
export default class MsgSend extends MsgBase<
  MsgSend.Params,
  MsgSend.Data,
  MsgSend.Proto,
  MsgSend.Amino,
  MsgSend.DirectSign
> {
  static fromJSON(params: MsgSend.Params): MsgSend {
    return new MsgSend(params)
  }

  public toProto(): MsgSend.Proto {
    const { params } = this

    const amountToSend = Coin.create()
    amountToSend.amount = params.amount.amount
    amountToSend.denom = params.amount.denom

    const message = BaseMsgSend.create()
    message.fromAddress = params.srcInjectiveAddress
    message.toAddress = params.dstInjectiveAddress
    message.amount = [amountToSend]

    return BaseMsgSend.fromPartial(message)
  }

  public toData(): MsgSend.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...proto,
    }
  }

  public toAmino(): MsgSend.Amino {
    const proto = this.toProto()

    const message = {
      ...snakeCaseKeys(proto),
      amount: proto.amount.map((amount) => snakeCaseKeys(amount)),
    }

    return {
      type: 'cosmos-sdk/MsgSend',
      ...message,
    } as unknown as MsgSend.Amino
  }

  public toWeb3(): MsgSend.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...rest,
    } as unknown as MsgSend.Web3
  }

  public toDirectSign(): MsgSend.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.bank.v1beta1.MsgSend',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgSend.encode(this.toProto()).finish()
  }
}
