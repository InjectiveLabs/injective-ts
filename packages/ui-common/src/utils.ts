import { GrpcCoin } from '@injectivelabs/chain-consumer'
import { Coin, TransactionOptions } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import { DEFAULT_GAS_PRICE, TX_DEFAULTS_GAS } from './constants'

export const grpcCoinToUiCoin = (coin: GrpcCoin): Coin => ({
  amount: coin.getAmount(),
  denom: coin.getDenom(),
})

export const cosmosSdkDecToBigNumber = (
  number: string | number | BigNumber,
): BigNumber => new BigNumber(number).dividedBy(new BigNumber(10).pow(18))

export const uint8ArrayToString = (
  string: string | Uint8Array | null | undefined,
): string => {
  if (!string) {
    return ''
  }

  if (string.constructor !== Uint8Array) {
    return string as string
  }

  return new TextDecoder().decode(string)
}

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})
