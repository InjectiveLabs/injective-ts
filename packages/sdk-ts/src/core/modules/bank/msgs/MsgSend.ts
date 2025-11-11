import * as CosmosBankV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/tx_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgSend {
  export interface Params {
    amount:
      | {
          denom: string
          amount: string
        }
      | {
          denom: string
          amount: string
        }[]
    srcInjectiveAddress: string
    dstInjectiveAddress: string
  }

  export type Proto = CosmosBankV1Beta1TxPb.MsgSend
}

/**
 * @category Messages
 */
export default class MsgSend extends MsgBase<MsgSend.Params, MsgSend.Proto> {
  static fromJSON(params: MsgSend.Params): MsgSend {
    return new MsgSend(params)
  }

  public toProto() {
    const { params } = this

    const amounts = Array.isArray(params.amount)
      ? params.amount
      : [params.amount]
    const amountsToSend = amounts.map((amount) => {
      return CosmosBaseV1Beta1CoinPb.Coin.create({
        denom: amount.denom,
        amount: amount.amount,
      })
    })

    const message = CosmosBankV1Beta1TxPb.MsgSend.create({
      fromAddress: params.srcInjectiveAddress,
      toAddress: params.dstInjectiveAddress,
      amount: amountsToSend,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      from_address: proto.fromAddress,
      to_address: proto.toAddress,
      amount: proto.amount,
    }

    return {
      type: 'cosmos-sdk/MsgSend',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.bank.v1beta1.MsgSend',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.bank.v1beta1.MsgSend',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosBankV1Beta1TxPb.MsgSend.toBinary(this.toProto())
  }
}
