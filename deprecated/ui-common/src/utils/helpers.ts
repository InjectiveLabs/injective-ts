import { GrpcCoin } from '@injectivelabs/chain-consumer'
import {
  Coin,
  TransactionOptions,
  AccountAddress,
} from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import { bech32 } from 'bech32'
import { Address } from 'ethereumjs-util'
import { PageResponse } from '@injectivelabs/chain-api/cosmos/base/query/v1beta1/pagination_pb'
import { Pagination } from '../types/pagination'
import { DEFAULT_GAS_PRICE, TX_DEFAULTS_GAS } from '../constants'

export const getInjectiveAddress = (address: AccountAddress): string => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer()

  return bech32.encode('inj', bech32.toWords(addressBuffer))
}

export const getAddressFromInjectiveAddress = (
  address: AccountAddress,
): string => {
  if (address.startsWith('0x')) {
    return address
  }

  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(address).words),
  ).toString('hex')}`
}

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

export const getDecimalsFromNumber = (number: number | string): number => {
  const UI_DEFAULT_MAX_DISPLAY_DECIMALS = 4
  const numberToBn = new BigNumber(number).toNumber()
  const numberParts = numberToBn.toString().split('.')
  const [, decimals] = numberParts

  const actualDecimals = decimals ? decimals.length : 0

  return actualDecimals > UI_DEFAULT_MAX_DISPLAY_DECIMALS
    ? UI_DEFAULT_MAX_DISPLAY_DECIMALS
    : actualDecimals
}

export const generatePagination = (pagination: Pagination | undefined) => {
  if (!pagination) {
    return
  }

  if (!pagination.next) {
    return
  }

  return {
    pagination: {
      key: pagination.next,
    },
  }
}

export const paginationUint8ArrayToString = (key: any) => {
  if (key.constructor !== Uint8Array) {
    return key as string
  }

  return new TextDecoder().decode(key)
}

export const pageResponseToPagination = ({
  newPagination,
  oldPagination,
}: {
  newPagination?: PageResponse | undefined
  oldPagination: Pagination | undefined
}): Pagination => {
  if (!newPagination) {
    return {
      prev: null,
      current: null,
      next: null,
    }
  }

  const next = paginationUint8ArrayToString(newPagination.getNextKey_asB64())

  if (!oldPagination) {
    return {
      prev: null,
      current: null,
      next,
    }
  }

  return {
    prev: oldPagination.current,
    current: oldPagination.next,
    next,
  }
}
