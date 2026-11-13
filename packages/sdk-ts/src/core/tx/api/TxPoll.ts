import {
  isAbortError,
  raceWithAbort,
  throwIfAborted,
  createAbortError,
  combineAbortSignals,
} from '@injectivelabs/utils'
import type { RequestOptions } from '@injectivelabs/utils'
import type { TxResponse } from '../types/tx.js'

/**
 * Runs one polling attempt behind a fresh child controller.
 *
 * The attempt deadline only cancels that attempt: it resolves to `null`, which
 * lets the polling loop start a new attempt. Caller cancellation is rethrown as
 * the shared local `AbortError`, preserving the caller's reason.
 */
export async function fetchTxWithAttemptTimeout({
  txHash,
  timeout,
  signal,
  fetchTx,
}: {
  txHash: string
  timeout: number
  signal?: AbortSignal
  fetchTx: (txHash: string, options?: RequestOptions) => Promise<TxResponse>
}): Promise<TxResponse | null> {
  throwIfAborted(signal)

  if (timeout <= 0) {
    return null
  }

  const attemptController = new AbortController()
  const attemptSignals = combineAbortSignals([signal, attemptController.signal])
  const attemptSignal = attemptSignals.signal as AbortSignal
  let timedOut = false

  const timer = setTimeout(() => {
    timedOut = true
    attemptController.abort()
  }, timeout)

  try {
    return await raceWithAbort(
      fetchTx(txHash, { signal: attemptSignal }),
      attemptSignal,
    )
  } catch (e: unknown) {
    if (signal?.aborted) {
      throw createAbortError(signal)
    }

    if ((isAbortError(e) || attemptSignal.aborted) && timedOut) {
      return null
    }

    throw e
  } finally {
    clearTimeout(timer)
    attemptSignals.dispose()
  }
}
