import { MsgBase } from '../../MsgBase.js'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '@injectivelabs/utils'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectivePeggyV1Beta1Msgs,
} from '@injectivelabs/core-proto-ts'

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

  export type Proto = InjectivePeggyV1Beta1Msgs.MsgSendToEth
}

/**
 * @category Messages
 */
export default class MsgSendToEth extends MsgBase<
  MsgSendToEth.Params,
  MsgSendToEth.Proto
> {
  static fromJSON(params: MsgSendToEth.Params): MsgSendToEth {
    return new MsgSendToEth(params)
  }

  public toProto() {
    const { params } = this

    const coinAmount = CosmosBaseV1Beta1Coin.Coin.create()

    coinAmount.denom = params.amount.denom
    coinAmount.amount = params.amount.amount

    const bridgeFee = CosmosBaseV1Beta1Coin.Coin.create()

    bridgeFee.denom = params.bridgeFee
      ? params.bridgeFee.denom
      : DEFAULT_BRIDGE_FEE_DENOM

    bridgeFee.amount = params.bridgeFee
      ? params.bridgeFee.amount
      : DEFAULT_BRIDGE_FEE_AMOUNT

    const message = InjectivePeggyV1Beta1Msgs.MsgSendToEth.create()

    message.sender = params.injectiveAddress
    message.ethDest = params.address
    message.amount = coinAmount
    message.bridgeFee = bridgeFee

    return InjectivePeggyV1Beta1Msgs.MsgSendToEth.fromPartial(message)
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

  public toWeb3Gw() {
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
    return InjectivePeggyV1Beta1Msgs.MsgSendToEth.encode(
      this.toProto(),
    ).finish()
  }
}
