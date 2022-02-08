import { GrpcCoin } from '@injectivelabs/chain-consumer'
import { UiSupplyCoin } from './types'
import { cosmosSdkDecToBigNumber } from '../utils'

export const grpcCoinsSupplyToUiCoins = (
  grpcCoins: GrpcCoin[],
): UiSupplyCoin[] => {
  const supply = grpcCoins.map((coin) => {
    const denom = coin.getDenom()

    return {
      denom,
      amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
    }
  })

  return supply
}

export class BankTransformer {
  static grpcCoinsSupplyToUiCoins = grpcCoinsSupplyToUiCoins
}
