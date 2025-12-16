import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveTokenFactoryV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import type { TypedDataField } from '../../../tx/index.js'

export declare namespace MsgBurn {
  export interface Params {
    sender: string
    burnFromAddress?: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1TxPb.MsgBurn
}

/**
 * @category Messages
 */
export default class MsgBurn extends MsgBase<MsgBurn.Params, MsgBurn.Proto> {
  static fromJSON(params: MsgBurn.Params): MsgBurn {
    return new MsgBurn(params)
  }

  public toProto() {
    const { params } = this

    const coin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveTokenFactoryV1Beta1TxPb.MsgBurn.create({
      sender: params.sender,
      amount: coin,
      ...(params.burnFromAddress && {
        burnFromAddress: params.burnFromAddress,
      }),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgBurn',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      amount: proto.amount,
      ...(proto.burnFromAddress && { burnFromAddress: proto.burnFromAddress }),
    }

    return {
      type: 'injective/tokenfactory/burn',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.tokenfactory.v1beta1.MsgBurn',
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
        name: 'burnFromAddress',
        type: 'string',
      },
    ])

    return map
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.tokenfactory.v1beta1.MsgBurn',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveTokenFactoryV1Beta1TxPb.MsgBurn.toBinary(this.toProto())
  }
}
