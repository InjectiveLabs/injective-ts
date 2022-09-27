import { Coin as GrpcCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
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

  if (typeof window !== 'undefined') {
    return true
  }

  return !isReactNative() && !isNode()
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

export const grpcCoinToUiCoin = (coin: GrpcCoin): Coin => ({
  amount: coin.getAmount(),
  denom: coin.getDenom(),
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

export const toPascalCase = (str: string): string => {
  return `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const snakeToPascal = (str: string): string => {
  return str
    .split('/')
    .map((snake) =>
      snake
        .split('_')
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join(''),
    )
    .join('/')
}
