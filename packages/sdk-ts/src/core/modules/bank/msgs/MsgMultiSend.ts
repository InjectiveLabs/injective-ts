import * as CosmosBankV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/tx_pb.mjs'
import * as CosmosBankV1Beta1BankPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/bank_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgMultiSend {
  export interface Params {
    inputs: {
      address: string
      coins: CosmosBaseV1Beta1CoinPb.Coin[]
    }[]
    outputs: {
      address: string
      coins: CosmosBaseV1Beta1CoinPb.Coin[]
    }[]
  }

  export type Proto = CosmosBankV1Beta1TxPb.MsgMultiSend
}

/**
 * @category Messages
 */
export default class MsgMultiSend extends MsgBase<
  MsgMultiSend.Params,
  MsgMultiSend.Proto
> {
  static fromJSON(params: MsgMultiSend.Params): MsgMultiSend {
    return new MsgMultiSend(params)
  }

  public toProto() {
    const { params } = this

    const inputs = params.inputs.map((i) => {
      return CosmosBankV1Beta1BankPb.Input.create({
        address: i.address,
        coins: i.coins.map((c: CosmosBaseV1Beta1CoinPb.Coin) => {
          return CosmosBaseV1Beta1CoinPb.Coin.create({
            denom: c.denom,
            amount: c.amount,
          })
        }),
      })
    })

    const outputs = params.outputs.map((o) => {
      return CosmosBankV1Beta1BankPb.Output.create({
        address: o.address,
        coins: o.coins.map((c: CosmosBaseV1Beta1CoinPb.Coin) => {
          return CosmosBaseV1Beta1CoinPb.Coin.create({
            denom: c.denom,
            amount: c.amount,
          })
        }),
      })
    })

    const message = CosmosBankV1Beta1TxPb.MsgMultiSend.create({
      inputs: inputs,
      outputs: outputs,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgMultiSend',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      inputs: proto.inputs,
      outputs: proto.outputs,
    }

    return {
      type: 'cosmos-sdk/MsgMultiSend',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.bank.v1beta1.MsgMultiSend',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.bank.v1beta1.MsgMultiSend',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosBankV1Beta1TxPb.MsgMultiSend.toBinary(this.toProto())
  }
}
