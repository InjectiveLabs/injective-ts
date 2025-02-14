import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index.js'

export class IndexerCommonTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }
}
