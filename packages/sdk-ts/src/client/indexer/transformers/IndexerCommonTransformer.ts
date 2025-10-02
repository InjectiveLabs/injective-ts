import type { Coin } from '@injectivelabs/ts-types'
import type { GrpcCoin } from '../../../types/index.js'

export class IndexerCommonTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }
}
