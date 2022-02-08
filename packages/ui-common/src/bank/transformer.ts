import { GrpcCoin } from '@injectivelabs/chain-consumer'
import { UiSupplyCoinWithoutLabel } from './types'
import { cosmosSdkDecToBigNumber } from '../utils'

export const grpcCoinsSupplyToUiCoins = (
  grpcCoins: GrpcCoin[],
): UiSupplyCoinWithoutLabel[] => {
  const supply = grpcCoins.map((coin) => {
    const denom = coin.getDenom()

    return {
      denom,
      code: denom,
      amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
    }
  })

  return supply
}

export class BankTransformer {
  static grpcCoinsSupplyToUiCoins = grpcCoinsSupplyToUiCoins
}
