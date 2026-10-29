import {
  toBigNumber,
  combineAbortSignals,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxGrpcApi } from './TxGrpcApi.js'
import { TxRestApi } from './TxRestApi.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { TxResponse } from '../types/index.js'
import type { WaitTxBroadcastedOptions } from './types.js'

export type {
  WaitTxBroadcastedArgs,
  WaitTxBroadcastedOptions,
} from './types.js'

export const waitTxBroadcasted = (
  txHash: string,
  options: WaitTxBroadcastedOptions,
  requestOptions?: RequestOptions,
): Promise<TxResponse> => {
  const timeout = toBigNumber(
    options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  )
    .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
    .toNumber()

  const cancellation = combineAbortSignals([
    options.signal,
    options.abortSignal,
    requestOptions?.signal,
  ])

  const waitArgs = {
    txHash,
    timeout,
    options: options.txInclusion,
    signal: cancellation.signal,
  }
  const txApi = options.endpoints.grpc
    ? new TxGrpcApi(options.endpoints.grpc)
    : new TxRestApi(options.endpoints.rest)
  const waitForInclusion = requestOptions
    ? txApi.waitForTxInclusion(waitArgs, requestOptions)
    : txApi.waitForTxInclusion(waitArgs)

  return waitForInclusion.finally(() => {
    cancellation.dispose()
  })
}
