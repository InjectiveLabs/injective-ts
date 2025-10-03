import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  CosmosDistributionV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import type { Coin } from '@injectivelabs/ts-types'

export declare namespace MsgFundCommunityPool {
  export interface Params {
    amount: Coin[]
    depositor: string
  }

  export type Proto = CosmosDistributionV1Beta1Tx.MsgFundCommunityPool
}

/**
 * @category Messages
 */
export default class MsgFundCommunityPool extends MsgBase<
  MsgFundCommunityPool.Params,
  MsgFundCommunityPool.Proto
> {
  static fromJSON(params: MsgFundCommunityPool.Params): MsgFundCommunityPool {
    return new MsgFundCommunityPool(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosDistributionV1Beta1Tx.MsgFundCommunityPool.create()

    message.depositor = params.depositor

    const coins = params.amount.map((amount) => {
      const coin = CosmosBaseV1Beta1Coin.Coin.create()
      coin.denom = amount.denom
      coin.amount = amount.amount

      return coin
    })

    message.amount = coins

    return CosmosDistributionV1Beta1Tx.MsgFundCommunityPool.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgFundCommunityPool',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgFundCommunityPool',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.distribution.v1beta1.MsgFundCommunityPool',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.distribution.v1beta1.MsgFundCommunityPool',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosDistributionV1Beta1Tx.MsgFundCommunityPool.encode(
      this.toProto(),
    ).finish()
  }
}
