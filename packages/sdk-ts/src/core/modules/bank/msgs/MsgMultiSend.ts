import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgMultiSend as BaseMsgMultiSend } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/tx_pb'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'
import { Input } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'
import { Output } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'

export declare namespace MsgMultiSend {
  export interface Params {
    inputs: {
      address: string
      coins: Coin.AsObject[]
    }[]
    outputs: {
      address: string
      coins: Coin.AsObject[]
    }[]
  }

  export type Proto = BaseMsgMultiSend

  export type Object = BaseMsgMultiSend.AsObject
}

/**
 * @category Messages
 */
export default class MsgMultiSend extends MsgBase<
  MsgMultiSend.Params,
  MsgMultiSend.Proto,
  MsgMultiSend.Object
> {
  static fromJSON(params: MsgMultiSend.Params): MsgMultiSend {
    return new MsgMultiSend(params)
  }

  public toProto() {
    const { params } = this

    const inputs = params.inputs.map((i) => {
      const input = new Input()

      input.setAddress(i.address)
      input.setCoinsList(
        i.coins.map((c) => {
          const coin = new Coin()

          coin.setAmount(c.amount)
          coin.setDenom(c.denom)

          return coin
        }),
      )

      return input
    })

    const outputs = params.outputs.map((o) => {
      const output = new Output()

      output.setAddress(o.address)
      output.setCoinsList(
        o.coins.map((c) => {
          const coin = new Coin()

          coin.setAmount(c.amount)
          coin.setDenom(c.denom)

          return coin
        }),
      )

      return output
    })

    const message = new BaseMsgMultiSend()
    message.setInputsList(inputs)
    message.setOutputsList(outputs)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.bank.v1beta1.MsgMultiSend',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
      inputs: proto
        .getInputsList()
        .map((amount) => snakecaseKeys(amount.toObject())),
      outputs: proto
        .getOutputsList()
        .map((amount) => snakecaseKeys(amount.toObject())),
    }

    // @ts-ignore
    delete message.inputs_list
    // @ts-ignore
    delete message.outputs_list

    return {
      type: 'cosmos-sdk/MsgMultiSend',
      value: message as unknown as SnakeCaseKeys<MsgMultiSend.Object>,
    }
  }

  public toWeb3() {
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
}
