import { MsgSendToEth as BaseMsgSendToEth } from '@injectivelabs/core-proto-ts/injective/peggy/v1/msgs'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '@injectivelabs/utils'

export declare namespace MsgSendToEth {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    bridgeFee?: {
      denom: string
      amount: string
    }
    address: string
    injectiveAddress: string
  }

  export interface DirectSign {
    type: '/injective.peggy.v1.MsgSendToEth'
    message: BaseMsgSendToEth
  }

  export interface Data extends BaseMsgSendToEth {
    '@type': '/injective.peggy.v1.MsgSendToEth'
  }

  export interface Amino extends BaseMsgSendToEth {
    type: 'peggy/MsgSendToEth'
  }

  export interface Web3 extends BaseMsgSendToEth {
    '@type': '/injective.peggy.v1beta1.MsgSendToEth'
  }

  export type Proto = BaseMsgSendToEth
}

/**
 * @category Messages
 */
export default class MsgSendToEth extends MsgBase<
  MsgSendToEth.Params,
  MsgSendToEth.Data,
  MsgSendToEth.Proto,
  MsgSendToEth.Amino,
  MsgSendToEth.DirectSign
> {
  static fromJSON(params: MsgSendToEth.Params): MsgSendToEth {
    return new MsgSendToEth(params)
  }

  public toProto(): MsgSendToEth.Proto {
    const { params } = this

    const coinAmount = Coin.create()
    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const bridgeFee = Coin.create()
    bridgeFee.denom = params.bridgeFee
      ? params.bridgeFee.denom
      : DEFAULT_BRIDGE_FEE_DENOM

    bridgeFee.amount = params.bridgeFee
      ? params.bridgeFee.amount
      : DEFAULT_BRIDGE_FEE_AMOUNT

    const message = BaseMsgSendToEth.create()
    message.amount = coinAmount
    message.sender = params.injectiveAddress
    message.ethDest = params.address
    message.bridgeFee = bridgeFee

    return BaseMsgSendToEth.fromPartial(message)
  }

  public toData(): MsgSendToEth.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...proto,
    }
  }

  public toAmino(): MsgSendToEth.Amino {
    const proto = this.toProto()

    return {
      type: 'peggy/MsgSendToEth',
      ...proto,
    }
  }

  public toWeb3(): MsgSendToEth.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...rest,
    } as unknown as MsgSendToEth.Web3
  }

  public toDirectSign(): MsgSendToEth.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.peggy.v1.MsgSendToEth',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgSendToEth.encode(this.toProto()).finish()
  }
}
