import BigNumber from 'bignumber.js'
import {
  DEFAULT_STD_FEE,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from './constants'
import BigNumberInBase from './classes/BigNumber/BigNumberInBase'
import BigNumberInWei from './classes/BigNumber/BigNumberInWei'

export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))

/**
 * When we want to execute the promises in batch
 */
export const awaitAll = async <T, S>(
  array: Array<T>,
  callback: (item: T) => Promise<S>,
): Promise<Awaited<S>[]> =>
  await Promise.all(array.map(async (item: T) => await callback(item)))

/**
 * When we want to execute the promises one by one
 * and not all in batch as with await Promise.all()
 */
export const awaitForAll = async <T, S>(
  array: Array<T>,
  callback: (item: T) => Promise<S>,
): Promise<S[]> => {
  const result = [] as S[]

  for (let i = 0; i < array.length; i += 1) {
    try {
      result.push(await callback(array[i]))
    } catch (e: any) {
      //
    }
  }

  return result
}

export const splitArrayToChunks = <T>({
  array,
  chunkSize,
  filter,
}: {
  array: Array<T>
  chunkSize: number
  filter?: (item: T) => boolean
}) => {
  const chunks = []

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)

    if (filter) {
      chunks.push(chunk.filter(filter))
    } else {
      chunks.push(chunk)
    }
  }

  return chunks
}

export const getStdFeeForToken = (
  token: {
    denom: string
    decimals: number
  } = { denom: 'inj', decimals: 18 },
  gasPrice?: string,
  gasLimit?: string,
) => {
  const gasPriceInBase =
    gasPrice || new BigNumberInWei(DEFAULT_GAS_PRICE).toBase()
  const gasPriceScaled = new BigNumberInBase(gasPriceInBase).toWei(
    token.decimals,
  )

  return {
    amount: [
      {
        denom: token.denom,
        amount: gasPriceScaled.times(DEFAULT_GAS_LIMIT).toFixed(),
      },
    ],
    gas: (gasLimit || DEFAULT_GAS_LIMIT).toString(),
  }
}

export const getStdFee = (
  gas: string = DEFAULT_GAS_LIMIT.toString(),
  gasPrice = DEFAULT_GAS_PRICE,
) => ({
  amount: [
    {
      denom: 'inj',
      amount: new BigNumber(gas).times(gasPrice).toString(),
    },
  ],
  gas,
})

export const getDefaultStdFee = () => DEFAULT_STD_FEE
