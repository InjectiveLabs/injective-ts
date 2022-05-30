import { GrpcCoin } from '../../../types/index'
import { Coin } from '@injectivelabs/ts-types'
import { cosmosSdkDecToBigNumber } from '../../../utils/numbers'

export const grpcCoinToCoin = (coin: GrpcCoin): Coin => {
  return {
    denom: coin.getDenom(),
    amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
  }
}

export const grpcCoinsToCoins = (coins: GrpcCoin[]): Coin[] => {
  return coins.map((coin) => grpcCoinToCoin(coin))
}

export class ChainGrpcBankTransformer {
  static grpcCoinToCoin = grpcCoinToCoin

  static grpcCoinsToCoins = grpcCoinsToCoins
}
