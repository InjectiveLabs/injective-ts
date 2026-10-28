import { AbortError } from '@injectivelabs/utils'

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
