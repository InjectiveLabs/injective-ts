import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type { TypedDataField } from '../../../tx/index.js'

export declare namespace MsgMint {
  export interface Params {
    sender: string
    receiver?: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgMint
}

/**
 * @category Messages
 */
export default class MsgMint extends MsgBase<MsgMint.Params, MsgMint.Proto> {
  static fromJSON(params: MsgMint.Params): MsgMint {
    return new MsgMint(params)
  }

  public toProto() {
    const { params } = this

    const coin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgMint.create({
      sender: params.sender,
      amount: coin,
      receiver: params.receiver || '',
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      amount: proto.amount,
      ...(proto.receiver !== undefined
        ? { receiver: proto.receiver }
        : { receiver: '' }),
    }

    return {
      type: 'injective/tokenfactory/mint',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgMint',
      ...value,
    }
  }

  public toEip712Types() {
    const map = new Map<string, TypedDataField[]>()

    map.set('TypeAmount', [
      {
        name: 'denom',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'string',
      },
    ])

    map.set('MsgValue', [
      {
        name: 'sender',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'TypeAmount',
      },
      {
        name: 'receiver',
        type: 'string',
      },
    ])

    return map
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error('EIP712_v1 is not supported for MsgMint. Please use EIP712_v2'),
    )
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgMint',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1TxPb.MsgMint.toBinary(this.toProto())
  }
}
