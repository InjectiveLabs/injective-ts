import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxResponse } from '../types'
import { TxGrpcApi } from './TxGrpcApi'
import { TxRestApi } from './TxRestApi'

export const waitTxBroadcasted = (
  txHash: string,
  options: { endpoints: { grpc?: string; rest: string }; txTimeout?: number },
): Promise<TxResponse> => {
  const timeout = new BigNumberInBase(
    options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  )
    .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
    .toNumber()

  return options.endpoints.grpc
    ? new TxGrpcApi(options.endpoints.grpc).fetchTxPoll(txHash, timeout)
    : new TxRestApi(options.endpoints.rest).fetchTxPoll(txHash, timeout)
}
