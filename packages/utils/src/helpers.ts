import {
  getDefaultStdFee,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from './constants.js'
import {
  toChainFormat,
  toHumanReadable,
  default as BigNumber,
} from './classes/BigNumber.js'
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

export const splitArrayToChunksThrow = <T>({
  array,
  filter,
  chunkSize,
}: {
  array: Array<T>
  chunkSize: number
  filter?: (item: T) => boolean
}) => {
  const chunks = []
  const chunkSizeInNumber = Number(chunkSize)

  if (isNaN(chunkSizeInNumber)) {
    throw new Error('Invalid chunk size, must be a valid number')
  }

  for (let i = 0; i < array.length; i += chunkSizeInNumber) {
    const chunk = array.slice(i, i + chunkSizeInNumber)

    if (filter) {
      chunks.push(chunk.filter(filter))
    } else {
      chunks.push(chunk)
    }
  }

  return chunks
}

export const splitArrayToChunks = <T>({
  array,
  filter,
  chunkSize,
}: {
  array: Array<T>
  chunkSize: number
  filter?: (item: T) => boolean
}) => {
  try {
    return splitArrayToChunksThrow({ array, chunkSize, filter })
  } catch (e: any) {
    return [array]
  }
}

export const getStdFeeForToken = (
  token: {
    denom: string
    decimals: number
  } = { denom: 'inj', decimals: 18 },
  gasPrice?: string,
  gasLimit?: string,
) => {
  const gasPriceInBase = gasPrice || toHumanReadable(DEFAULT_GAS_PRICE, 18)
  const gasPriceScaled = toChainFormat(gasPriceInBase, token.decimals).toFixed(
    0,
  )
  const gasNormalized = new BigNumber(gasLimit || DEFAULT_GAS_LIMIT).toFixed(0)

  return {
    amount: [
      {
        denom: token.denom,
        amount: new BigNumber(gasPriceScaled).times(gasNormalized).toFixed(),
      },
    ],
    gas: (gasLimit || DEFAULT_GAS_LIMIT).toString(),
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
    return getDefaultStdFee()
  }

  const gasPriceInBase = args.gasPrice || toHumanReadable(DEFAULT_GAS_PRICE, 18)
  const gasPriceScaled = toChainFormat(gasPriceInBase, 18).toFixed(0)

  return {
    amount: [
      {
        denom: 'inj',
        amount: new BigNumber(args.gas || DEFAULT_GAS_LIMIT)
          .times(gasPriceScaled)
          .toFixed(0),
      },
    ],
    gas: new BigNumber(args.gas || DEFAULT_GAS_LIMIT).toFixed(),
    payer: args.payer || '',
    granter: args.granter || '',
    feePayer: args.feePayer || '',
  }
}

export const getStdFeeFromString = (gasPrice: string) => {
  const gasPriceInBase = toHumanReadable(gasPrice, 18)
  const gasPriceScaled = toChainFormat(gasPriceInBase, 18).toFixed(0)

  return {
    amount: [
      {
        denom: 'inj',
        amount: new BigNumber(DEFAULT_GAS_LIMIT)
          .times(gasPriceScaled)
          .toFixed(0),
      },
    ],
    gas: DEFAULT_GAS_LIMIT.toString(),
  }
}

export const getStdFee = (
  args?:
    | string
    | {
        payer?: string
        granter?: string
        feePayer?: string
        gas?: string | number
        gasPrice?: string | number
      },
) => {
  if (!args) {
    return getDefaultStdFee()
  }

  if (typeof args === 'string') {
    return getStdFeeFromString(args)
  }

  return getStdFeeFromObject({ ...args })
}
