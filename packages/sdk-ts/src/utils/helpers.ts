import { Coin as GrpcCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { Coin } from '@injectivelabs/ts-types'

export const isServerSide = () => typeof window === 'undefined'

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
