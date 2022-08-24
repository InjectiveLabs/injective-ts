import { MsgSendToEth as BaseMsgSendToEth } from '@injectivelabs/chain-api/injective/peggy/v1/msgs_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'
import {
  DEFAULT_BRIDGE_FEE_AMOUNT,
  DEFAULT_BRIDGE_FEE_DENOM,
} from '../../../utils/constants'

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

  export interface Data extends BaseMsgSendToEth.AsObject {
    '@type': '/injective.peggy.v1.MsgSendToEth'
  }

  export interface Amino extends BaseMsgSendToEth.AsObject {
    type: 'peggy/MsgSendToEth'
  }

  export interface Web3 extends BaseMsgSendToEth.AsObject {
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

  public toData(): MsgSendToEth.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.peggy.v1.MsgSendToEth',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgSendToEth.Amino {
    const proto = this.toProto()

    return {
      type: 'peggy/MsgSendToEth',
      ...proto.toObject(),
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
}
