import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveTokenFactoryV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { TypedDataField } from '../../../tx/index.js'

export declare namespace MsgBurn {
  export interface Params {
    sender: string
    burnFromAddress?: string
    amount: {
      amount: string
      denom: string
    }
  }

  export type Proto = InjectiveTokenFactoryV1Beta1Tx.MsgBurn
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

    const coin = CosmosBaseV1Beta1Coin.Coin.create()

    coin.denom = params.amount.denom
    coin.amount = params.amount.amount

    const message = InjectiveTokenFactoryV1Beta1Tx.MsgBurn.create()

    message.sender = params.sender
    message.amount = coin

    if (params.burnFromAddress) {
      message.burnFromAddress = params.burnFromAddress
    }

    return InjectiveTokenFactoryV1Beta1Tx.MsgBurn.fromPartial(message)
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
      ...snakecaseKeys(proto),
      burnFromAddress: proto.burnFromAddress,
    }

    const { burn_from_address, ...messageWithoutBurnFromAddress } = message

    return {
      type: 'injective/tokenfactory/burn',
      value: messageWithoutBurnFromAddress,
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
    return InjectiveTokenFactoryV1Beta1Tx.MsgBurn.encode(
      this.toProto(),
    ).finish()
  }
}
