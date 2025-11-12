import {
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_AMOUNT,
} from '@injectivelabs/utils'
import * as InjectivePeggyV1MsgsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/msgs_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

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

  export type Proto = InjectivePeggyV1MsgsPb.MsgSendToEth
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

    const coinAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const bridgeFee = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.bridgeFee
        ? params.bridgeFee.denom
        : DEFAULT_BRIDGE_FEE_DENOM,
      amount: params.bridgeFee
        ? params.bridgeFee.amount
        : DEFAULT_BRIDGE_FEE_AMOUNT,
    })

    const message = InjectivePeggyV1MsgsPb.MsgSendToEth.create({
      sender: params.injectiveAddress,
      ethDest: params.address,
      amount: coinAmount,
      bridgeFee: bridgeFee,
    })

    return message
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
      sender: proto.sender,
      eth_dest: proto.ethDest,
      amount: proto.amount,
      bridge_fee: proto.bridgeFee,
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
    return InjectivePeggyV1MsgsPb.MsgSendToEth.toBinary(this.toProto())
  }
}
