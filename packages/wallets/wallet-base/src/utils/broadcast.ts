import { isAbortError } from '@injectivelabs/utils'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import {
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import { WalletAction } from '../types/enums.js'
import type { TxRaw } from '@injectivelabs/sdk-ts/types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { SendTransactionOptions } from '../types/strategy.js'

export type BroadcastTxRawOptions = Pick<
  SendTransactionOptions,
  'txTimeout' | 'txInclusion' | 'onBroadcast'
> &
  Partial<Pick<SendTransactionOptions, 'endpoints'>>

/**
 * Submits a signed transaction over gRPC (through `endpoints.broadcastGrpc`
 * when set) and waits for inclusion. Shared by every strategy that broadcasts
 * through the SDK instead of the wallet provider.
 */
export const broadcastTxRaw = async (
  txRaw: TxRaw,
  { endpoints, txTimeout, txInclusion, onBroadcast }: BroadcastTxRawOptions,
): Promise<TxResponse> => {
  if (!endpoints) {
    throw new WalletException(
      new Error('You have to pass endpoints within the options'),
    )
  }

  const response = await new TxGrpcApi(endpoints.grpc).broadcast(txRaw, {
    txTimeout,
    broadcastEndpoint: endpoints.broadcastGrpc,
    ...txInclusion,
    onBroadcast,
  })

  if (response.code !== 0) {
    throw new TransactionException(new Error(response.rawLog), {
      code: UnspecifiedErrorCode,
      contextCode: response.code,
      contextModule: response.codespace,
    })
  }

  return response
}

/**
 * Same as `broadcastTxRaw`, but failures surface as `TransactionException`
 * (cancellation passes through untouched) to match what Cosmos extension
 * strategies throw when the provider broadcasts.
 */
export const broadcastTxRawAsTransactionException = async (
  txRaw: TxRaw,
  options: BroadcastTxRawOptions,
): Promise<TxResponse> => {
  try {
    return await broadcastTxRaw(txRaw, options)
  } catch (e: unknown) {
    if (e instanceof TransactionException || isAbortError(e)) {
      throw e
    }

    throw new TransactionException(new Error((e as Error).message), {
      code: UnspecifiedErrorCode,
      context: WalletAction.SendTransaction,
    })
  }
}
