import snakecaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase.js'
import {
  CosmosBankV1Beta1Tx,
  CosmosBankV1Beta1Bank,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgMultiSend {
  export interface Params {
    inputs: {
      address: string
      coins: CosmosBaseV1Beta1Coin.Coin[]
    }[]
    outputs: {
      address: string
      coins: CosmosBaseV1Beta1Coin.Coin[]
    }[]
  }

  export type Proto = CosmosBankV1Beta1Tx.MsgMultiSend
}

/**
 * @category Messages
 */
export default class MsgMultiSend extends MsgBase<
  MsgMultiSend.Proto,
  MsgMultiSend.Params
> {
  static fromJSON(params: MsgMultiSend.Params): MsgMultiSend {
    return new MsgMultiSend(params)
  }

  public toProto() {
    const { params } = this

    const inputs = params.inputs.map((i) => {
      const input = CosmosBankV1Beta1Bank.Input.create()

      input.address = i.address
      input.coins = i.coins.map((c) => {
        const coin = CosmosBaseV1Beta1Coin.Coin.create()

        coin.denom = c.denom
        coin.amount = c.amount

        return coin
      })

      return input
    })

    const outputs = params.outputs.map((o) => {
      const output = CosmosBankV1Beta1Bank.Output.create()

      output.address = o.address
      output.coins = o.coins.map((c) => {
        const coin = CosmosBaseV1Beta1Coin.Coin.create()

        coin.denom = c.denom
        coin.amount = c.amount

        return coin
      })

      return output
    })

    const message = CosmosBankV1Beta1Tx.MsgMultiSend.create()

    message.inputs = inputs
    message.outputs = outputs

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
      ...snakecaseKeys(proto),
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
    return CosmosBankV1Beta1Tx.MsgMultiSend.encode(this.toProto()).finish()
  }
}
