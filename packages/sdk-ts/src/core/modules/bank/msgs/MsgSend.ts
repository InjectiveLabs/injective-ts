import snakecaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'
import {
  CosmosBankV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'

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

  export type Proto = CosmosBankV1Beta1Tx.MsgSend
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
      const amountToSend = CosmosBaseV1Beta1Coin.Coin.create()

      amountToSend.denom = amount.denom
      amountToSend.amount = amount.amount

      return amountToSend
    })

    const message = CosmosBankV1Beta1Tx.MsgSend.create()

    message.fromAddress = params.srcInjectiveAddress
    message.toAddress = params.dstInjectiveAddress
    message.amount = amountsToSend

    return CosmosBankV1Beta1Tx.MsgSend.fromPartial(message)
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
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgSend',
      value: message,
    }
  }

  public toWeb3() {
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
    return CosmosBankV1Beta1Tx.MsgSend.encode(this.toProto()).finish()
  }
}
