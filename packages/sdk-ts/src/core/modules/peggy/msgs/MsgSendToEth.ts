import { MsgSendToEth as BaseMsgSendToEth } from '@injectivelabs/core-proto-ts/injective/peggy/v1/msgs'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '@injectivelabs/utils'
import snakecaseKeys from 'snakecase-keys'

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

  export type Proto = BaseMsgSendToEth

  export type Object = BaseMsgSendToEth.AsObject
}

/**
 * @category Messages
 */
export default class MsgSendToEth extends MsgBase<
  MsgSendToEth.Params,
  MsgSendToEth.Proto,
  MsgSendToEth.Object
> {
  static fromJSON(params: MsgSendToEth.Params): MsgSendToEth {
    return new MsgSendToEth(params)
  }

  public toProto() {
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

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'peggy/MsgSendToEth',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...value,
    }
  }

  public toDirectSign() {
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
