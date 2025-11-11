import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as CosmosDistributionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import type { Coin } from '@injectivelabs/ts-types'
import type { TypedDataField } from '../../../tx/eip712/types.js'

export declare namespace MsgFundCommunityPool {
  export interface Params {
    amount: Coin[]
    depositor: string
  }

  export type Proto = CosmosDistributionV1Beta1TxPb.MsgFundCommunityPool
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

    const coins = params.amount.map((amount) => {
      return CosmosBaseV1Beta1CoinPb.Coin.create({
        denom: amount.denom,
        amount: amount.amount,
      })
    })

    const message = CosmosDistributionV1Beta1TxPb.MsgFundCommunityPool.create({
      depositor: params.depositor,
      amount: coins,
    })

    return message
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
      depositor: proto.depositor,
      amount: proto.amount,
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
    return CosmosDistributionV1Beta1TxPb.MsgFundCommunityPool.toBinary(
      this.toProto(),
    )
  }

  public toEip712Types(): Map<string, TypedDataField[]> {
    const map = new Map<string, TypedDataField[]>()

    map.set('TypeAmount', [
      { name: 'denom', type: 'string' },
      { name: 'amount', type: 'string' },
    ])

    map.set('MsgValue', [
      { name: 'amount', type: 'TypeAmount[]' },
      { name: 'depositor', type: 'string' },
    ])

    return map
  }

  public toEip712V2() {
    const proto = this.toProto()

    // Create object with explicit field order to ensure JSON serialization preserves order
    const result: any = {}
    result['@type'] = '/cosmos.distribution.v1beta1.MsgFundCommunityPool'
    result.amount = proto.amount
    result.depositor = proto.depositor

    return result
  }
}
