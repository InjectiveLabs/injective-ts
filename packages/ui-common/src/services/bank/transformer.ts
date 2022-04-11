import { GrpcCoin } from '@injectivelabs/chain-consumer'
import { UiSupplyCoin } from './types'
import { cosmosSdkDecToBigNumber } from '../../utils'

export const grpcCoinsSupplyToUiCoins = (
  grpcCoins: GrpcCoin[],
): UiSupplyCoin[] =>
  grpcCoins.map((coin) => ({
    denom: coin.getDenom(),
    amount: cosmosSdkDecToBigNumber(coin.getAmount()).toFixed(),
  }))

export class BankTransformer {
  static grpcCoinsSupplyToUiCoins = grpcCoinsSupplyToUiCoins
}
