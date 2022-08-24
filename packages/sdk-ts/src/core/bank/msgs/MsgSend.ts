import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgSend as BaseMsgSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
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

  export interface Data extends BaseMsgSend.AsObject {
    '@type': '/cosmos.bank.v1beta1.MsgSend'
  }

  export interface Amino extends BaseMsgSend.AsObject {
    type: 'cosmos-sdk/MsgSend'
  }

  export interface Web3 extends BaseMsgSend.AsObject {
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

    const amountToSend = new Coin()
    amountToSend.setAmount(params.amount.amount)
    amountToSend.setDenom(params.amount.denom)

    const message = new BaseMsgSend()
    message.setFromAddress(params.srcInjectiveAddress)
    message.setToAddress(params.dstInjectiveAddress)
    message.setAmountList([amountToSend])

    return message
  }

  public toData(): MsgSend.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgSend.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto.toObject()),
      amount: proto
        .getAmountList()
        .map((amount) => snakeCaseKeys(amount.toObject())),
    }

    // @ts-ignore
    delete message.amount_list

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
}
