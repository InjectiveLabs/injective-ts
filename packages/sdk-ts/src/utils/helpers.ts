import { CosmosBaseV1Beta1Coin } from '@injectivelabs/core-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

export const isServerSide = () => typeof window === 'undefined'

export const isReactNative = () => {
  return (
    typeof document === 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.product === 'ReactNative'
  )
}

export const isNode = () => {
  if (typeof window === 'undefined') {
    return true
  }

  return (
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    typeof process.versions.node !== 'undefined'
  )
}

export const isBrowser = () => {
  if (isReactNative()) {
    return false
  }

  if (isNode()) {
    return false
  }

  return typeof window !== 'undefined'
}

export const objectToJson = (
  object: Record<string, any>,
  params?:
    | {
        replacer?: any
        indentation?: number
      }
    | undefined,
): string => {
  const { replacer, indentation } = params || { replacer: null, indentation: 2 }

  return JSON.stringify(object, replacer, indentation)
}

export const protoObjectToJson = (
  object: any,
  params?:
    | {
        replacer?: any
        indentation?: number
      }
    | undefined,
): string => {
  const { replacer, indentation } = params || { replacer: null, indentation: 2 }

  if (object.toObject !== undefined) {
    return JSON.stringify(object.toObject(), replacer, indentation)
  }

  return objectToJson(object, { replacer, indentation })
}

export const grpcCoinToUiCoin = (coin: CosmosBaseV1Beta1Coin.Coin): Coin => ({
  amount: coin.amount,
  denom: coin.denom,
})

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

export const sortObjectByKeysWithReduce = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map((e) => sortObjectByKeysWithReduce(e)).sort() as T
  }

  return Object.keys(obj)
    .sort()
    .reduce((sorted, k) => {
      const key = k as keyof typeof obj
      sorted[key] = sortObjectByKeysWithReduce(obj[key])
      return sorted
    }, {} as T)
}

export const sortObjectByKeys = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectByKeys) as T
  }

  const sortedKeys = Object.keys(obj).sort() as Array<keyof typeof obj>
  const result = {} as Record<keyof typeof obj, any>

  sortedKeys.forEach((key) => {
    result[key] = sortObjectByKeys(obj[key])
  })

  return result as T
}

export const getErrorMessage = (error: any, endpoint: string): string => {
  if (!error.response) {
    return `The request to ${endpoint} has failed.`
  }

  return error.response.data
    ? error.response.data.message || error.response.data
    : error.response.statusText
}

/**
 * Converts value to it's number representation
 */
export const hexToNumber = (value: string): number => {
  const [negative, hexValue] = value.startsWith('-')
    ? [true, value.slice(1)]
    : [false, value]
  const num = BigInt(hexValue)

  if (num > Number.MAX_SAFE_INTEGER) {
    return Number(negative ? -num : num)
  }

  if (num < Number.MIN_SAFE_INTEGER) {
    return Number(num)
  }

  return negative ? -1 * Number(num) : Number(num)
}
