import { AbortError, isAbortError } from '@injectivelabs/utils'

/**
 * Transaction observation was cancelled, not necessarily the transaction itself.
 * Use txHash to resume observation; cancellation is not proof of chain failure.
 */
export class TxObservationAbortError extends AbortError {
  readonly txHash: string

  constructor(txHash: string, reason?: unknown) {
    super(reason)

    this.txHash = txHash
  }
}

/**
 * Observe an already-submitted transaction, retaining its recovery hash on
 * cancellation. Call only after successful submission; this does not cancel
 * the broadcast mutation. Include post-submission callbacks in this scope.
 */
export async function observeTx<T>(
  txHash: string,
  observe: () => T | PromiseLike<T>,
): Promise<T> {
  try {
    return await observe()
  } catch (error: unknown) {
    if (isAbortError(error) && !(error instanceof TxObservationAbortError)) {
      throw new TxObservationAbortError(txHash, error.reason)
    }

    throw error
  }
}
