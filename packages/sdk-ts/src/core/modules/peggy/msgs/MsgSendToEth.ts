import { MsgSendToEth as BaseMsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1/msgs_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

    const coinAmount = new Coin()
    coinAmount.setDenom(params.amount.denom)
    coinAmount.setAmount(params.amount.amount)

    const bridgeFee = new Coin()
    bridgeFee.setDenom(
      params.bridgeFee ? params.bridgeFee.denom : DEFAULT_BRIDGE_FEE_DENOM,
    )
    bridgeFee.setAmount(
      params.bridgeFee ? params.bridgeFee.amount : DEFAULT_BRIDGE_FEE_AMOUNT,
    )

    const message = new BaseMsgSendToEth()
    message.setAmount(coinAmount)
    message.setSender(params.injectiveAddress)
    message.setEthDest(params.address)
    message.setBridgeFee(bridgeFee)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
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
}
