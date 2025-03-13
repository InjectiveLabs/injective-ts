import {
  DEFAULT_STD_FEE,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from './constants.js'
import BigNumberInBase from './classes/BigNumber/BigNumberInBase.js'
import BigNumberInWei from './classes/BigNumber/BigNumberInWei.js'
import { Awaited } from './types.js'

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
  const gasPriceScaled = new BigNumberInBase(gasPriceInBase)
    .toWei(token.decimals)
    .toFixed(0)
  const gasNormalized = new BigNumberInBase(
    gasLimit || DEFAULT_GAS_LIMIT,
  ).toFixed(0)

  return {
    amount: [
      {
        denom: token.denom,
        amount: new BigNumberInBase(gasPriceScaled)
          .times(gasNormalized)
          .toFixed(),
      },
    ],
    gas: gasNormalized,
  }
}

export const getStdFeeFromObject = (args?: {
  gas?: string | number
  payer?: string
  granter?: string
  gasPrice?: string | number
  feePayer?: string
}) => {
  if (!args) {
    return DEFAULT_STD_FEE
  }

  const {
    gas = DEFAULT_GAS_LIMIT.toString(),
    gasPrice = DEFAULT_GAS_PRICE,
    payer,
    granter,
    feePayer,
  } = args
  const gasNormalized = new BigNumberInBase(gas).toFixed(0)
  const gasPriceNormalized = new BigNumberInBase(gasPrice).toFixed(0)

  return {
    amount: [
      {
        denom: 'inj',
        amount: new BigNumberInBase(gasNormalized)
          .times(gasPriceNormalized)
          .toFixed(),
      },
    ],
    gas: new BigNumberInBase(gasNormalized).toFixed(),
    payer /** for Web3Gateway fee delegation */,
    granter,
    feePayer,
  }
}

export const getDefaultStdFee = () => DEFAULT_STD_FEE

export const getStdFeeFromString = (gasPrice: string) => {
  const matchResult = gasPrice.match(/^([0-9.]+)([a-zA-Z][a-zA-Z0-9/:._-]*)$/)

  if (!matchResult) {
    throw new Error('Invalid gas price string')
  }

  const [_, amount] = matchResult
  const gas = new BigNumberInBase(amount)
    .toWei()
    .dividedBy(DEFAULT_GAS_PRICE)
    .toFixed(0)

  return getStdFeeFromObject({ gas, gasPrice: DEFAULT_GAS_PRICE })
}

export const getStdFee = (
  args?:
    | string
    | {
        gas?: string | number
        payer?: string
        granter?: string
        gasPrice?: string | number
        feePayer?: string
      },
) => {
  if (!args) {
    return DEFAULT_STD_FEE
  }

  if (typeof args === 'string') {
    return getStdFeeFromString(args)
  }

  return getStdFeeFromObject({ ...args })
}
