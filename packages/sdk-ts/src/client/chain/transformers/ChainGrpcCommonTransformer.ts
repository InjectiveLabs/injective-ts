import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index.js'

export class ChainGrpcCommonTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }
}
