import {
  toBigNumber,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxGrpcApi } from './TxGrpcApi.js'
import { TxRestApi } from './TxRestApi.js'
import type { TxResponse, TxClientInclusionOptions } from '../types/index.js'

export const waitTxBroadcasted = (
  txHash: string,
  options: {
    endpoints: { grpc?: string; rest: string }
    txTimeout?: number
    txInclusion?: TxClientInclusionOptions
  },
): Promise<TxResponse> => {
  const timeout = toBigNumber(
    options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  )
    .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
    .toNumber()

  return options.endpoints.grpc
    ? new TxGrpcApi(options.endpoints.grpc).waitForTxInclusion({
        txHash,
        timeout,
        options: options.txInclusion,
      })
    : new TxRestApi(options.endpoints.rest).waitForTxInclusion({
        txHash,
        timeout,
        options: options.txInclusion,
      })
}
