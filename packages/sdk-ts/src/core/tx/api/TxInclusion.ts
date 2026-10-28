import {
  GeneralException,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  isAbortError,
  raceWithAbort,
  throwIfAborted,
  createAbortError,
  combineAbortSignals,
} from '@injectivelabs/utils'
import { TxInclusionStrategy } from '../types/tx.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { PrepareTxInclusionWaiterArgs } from './types.js'
import type {
  TxResponse,
  TxFetchTxPollArgs,
  TxInclusionWaiter,
  TxInclusionStrategy as TxInclusionStrategyType,
} from '../types/tx.js'

/**
 * Errors thrown by local cancellation must never be converted into fallback,
 * polling or transaction failures.
 */
const isLocalCancellation = (error: unknown, signal?: AbortSignal): boolean =>
  isAbortError(error) || Boolean(signal?.aborted)

interface InclusionWaiterLifecycle {
  signal: AbortSignal
  closed: boolean
  close: () => void
  finalize: () => void
}

function createInclusionWaiterLifecycle(
  signals: readonly (AbortSignal | undefined)[],
  disposeClientSignal?: () => void,
): InclusionWaiterLifecycle {
  const closeController = new AbortController()
  const combined = combineAbortSignals([...signals, closeController.signal])
  const signal = combined.signal as AbortSignal
  let closed = false
  let finalized = false

  const finalize = () => {
    if (finalized) {
      return
    }

    finalized = true
    signal.removeEventListener('abort', finalize)
    combined.dispose()
    disposeClientSignal?.()
  }

  // Prepared waiters may be aborted before wait() is ever called.
  signal.addEventListener('abort', finalize, { once: true })

  if (signal.aborted) {
    finalize()
  }

  return {
    signal,
    get closed() {
      return closed
    },
    close: () => {
      if (closed) {
        return
      }

      closed = true
      closeController.abort()
      finalize()
    },
    finalize,
  }
}

async function waitForAbortableOperation<T>(
  operation: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  try {
    return await raceWithAbort(operation, signal)
  } catch (e: unknown) {
    if (isAbortError(e)) {
      throw e
    }

    if (signal.aborted) {
      throw createAbortError(signal)
    }

    throw e
  }
}

function normalizeInclusionCancellation(
  error: unknown,
  signal: AbortSignal,
): void {
  if (isAbortError(error)) {
    throw error
  }

  if (signal.aborted) {
    throw createAbortError(signal)
  }
}

export function isTendermintEventStrategy(
  inclusionStrategy?: TxInclusionStrategyType,
) {
  return (
    inclusionStrategy === TxInclusionStrategy.TendermintEvent ||
    inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll
  )
}

export async function prepareTxInclusionWaiter(
  {
    txHash,
    timeout,
    options,
    signal,
    abortSignal,
    requestOptions: argsRequestOptions,
    clientSignal,
    disposeClientSignal,
    fetchTx,
    fetchTxPoll,
    createRequestException,
  }: PrepareTxInclusionWaiterArgs,
  requestOptions?: RequestOptions,
): Promise<TxInclusionWaiter> {
  const lifecycle = createInclusionWaiterLifecycle(
    [
      clientSignal,
      signal,
      abortSignal,
      options?.signal,
      options?.abortSignal,
      options?.eventInclusion?.signal,
      argsRequestOptions?.signal,
      requestOptions?.signal,
    ],
    disposeClientSignal,
  )
  const waiterSignal = lifecycle.signal
  const inclusionStrategy = options?.inclusionStrategy

  try {
    throwIfAborted(waiterSignal)

    if (!isTendermintEventStrategy(inclusionStrategy)) {
      return createPollingInclusionWaiter({
        txHash,
        timeout,
        options,
        fetchTxPoll,
        lifecycle,
      })
    }

    const eventOptions = options?.eventInclusion
    const rpcEndpoint = eventOptions?.rpcEndpoint
    const fallbackToPolling = eventOptions?.fallbackToPolling !== false

    if (!rpcEndpoint) {
      const error = new GeneralException(
        new Error('Tendermint RPC endpoint is required for event inclusion'),
      )

      throwIfAborted(waiterSignal)

      if (!fallbackToPolling) {
        throw createRequestException(error, 'event-inclusion')
      }

      eventOptions?.onFallback?.(error)
      throwIfAborted(waiterSignal)

      return createPollingInclusionWaiter({
        txHash,
        timeout,
        options,
        fetchTxPoll,
        lifecycle,
      })
    }

    try {
      const subscriptionPromise = subscribeToTendermintTxEvent({
        txHash,
        endpoint: rpcEndpoint,
        timeout: eventOptions?.timeout || timeout,
        webSocketFactory: eventOptions?.webSocketFactory,
        signal: waiterSignal,
      })

      // If cancellation wins while the subscription is still being prepared,
      // make sure a late subscription cannot leak an open socket.
      subscriptionPromise.then(
        (lateSubscription) => {
          if (waiterSignal.aborted) {
            lateSubscription.close()
          }
        },
        () => undefined,
      )

      const subscription = await raceWithAbort(
        subscriptionPromise,
        waiterSignal,
      )

      throwIfAborted(waiterSignal)

      return createTendermintInclusionWaiter({
        txHash,
        timeout,
        options,
        inclusionStrategy: inclusionStrategy as TxInclusionStrategyType,
        subscription,
        fetchTx,
        fetchTxPoll,
        createRequestException,
        lifecycle,
      })
    } catch (e: unknown) {
      normalizeInclusionCancellation(e, waiterSignal)

      if (e instanceof TransactionException) {
        throw e
      }

      const error = e instanceof Error ? e : new Error(String(e))

      throwIfAborted(waiterSignal)

      if (!fallbackToPolling) {
        throw createRequestException(error, 'event-inclusion')
      }

      eventOptions?.onFallback?.(error)
      throwIfAborted(waiterSignal)

      return createPollingInclusionWaiter({
        txHash,
        timeout,
        options,
        fetchTxPoll,
        lifecycle,
      })
    }
  } catch (e: unknown) {
    if (isAbortError(e)) {
      lifecycle.close()
      throw e
    }

    if (waiterSignal.aborted) {
      const cancellation = createAbortError(waiterSignal)

      lifecycle.close()
      throw cancellation
    }

    lifecycle.close()
    throw e
  }
}

function createPollingInclusionWaiter({
  txHash,
  timeout,
  options,
  fetchTxPoll,
  lifecycle,
}: Pick<
  PrepareTxInclusionWaiterArgs,
  'txHash' | 'timeout' | 'options' | 'fetchTxPoll'
> & { lifecycle: InclusionWaiterLifecycle }): TxInclusionWaiter {
  const waiterSignal = lifecycle.signal
  let waitPromise: Promise<TxResponse | undefined> | undefined

  const close = () => {
    lifecycle.close()
  }

  const wait = (includedTxHash = txHash): Promise<TxResponse | undefined> => {
    if (!waitPromise) {
      if (lifecycle.closed) {
        return Promise.reject(createAbortError(waiterSignal))
      }

      try {
        throwIfAborted(waiterSignal)
      } catch (e: unknown) {
        return Promise.reject(e)
      }

      waitPromise = waitForAbortableOperation(
        fetchTxPoll(
          createFetchTxPollArgs({
            txHash: includedTxHash,
            timeout,
            options,
            signal: waiterSignal,
          }),
        ),
        waiterSignal,
      ).finally(() => {
        lifecycle.finalize()
      })

      // Closing a waiter must not produce an unhandled rejection when the
      // caller attaches its handler later.
      waitPromise.then(
        () => undefined,
        () => undefined,
      )
    }

    return waitPromise
  }

  return {
    txHash,
    inclusionStrategy: TxInclusionStrategy.Poll,
    close,
    wait,
  }
}

function createTendermintInclusionWaiter({
  txHash,
  timeout,
  options,
  inclusionStrategy,
  subscription,
  fetchTx,
  fetchTxPoll,
  createRequestException,
  lifecycle,
}: PrepareTxInclusionWaiterArgs & {
  inclusionStrategy: TxInclusionStrategyType
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
  lifecycle: InclusionWaiterLifecycle
}): TxInclusionWaiter {
  const waiterSignal = lifecycle.signal
  let waitPromise: Promise<TxResponse | undefined> | undefined

  const close = () => {
    lifecycle.close()
    subscription.close()
  }

  const wait = (includedTxHash = txHash): Promise<TxResponse | undefined> => {
    if (!waitPromise) {
      if (lifecycle.closed) {
        return Promise.reject(createAbortError(waiterSignal))
      }

      try {
        throwIfAborted(waiterSignal)
      } catch (e: unknown) {
        return Promise.reject(e)
      }

      const operation = waitForIncludedTx({
        txHash,
        includedTxHash,
        timeout,
        options,
        inclusionStrategy,
        subscription,
        fetchTx,
        fetchTxPoll,
        createRequestException,
        signal: waiterSignal,
      })

      waitPromise = waitForAbortableOperation(operation, waiterSignal).finally(
        () => {
          subscription.close()
          lifecycle.finalize()
        },
      )

      waitPromise.then(
        () => undefined,
        () => undefined,
      )
    }

    return waitPromise
  }

  return {
    txHash,
    inclusionStrategy,
    close,
    wait,
  }
}

async function waitForIncludedTx({
  txHash,
  includedTxHash,
  timeout,
  options,
  inclusionStrategy,
  subscription,
  fetchTx,
  fetchTxPoll,
  createRequestException,
  signal,
}: PrepareTxInclusionWaiterArgs & {
  includedTxHash: string
  inclusionStrategy: TxInclusionStrategyType
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
  signal: AbortSignal
}): Promise<TxResponse | undefined> {
  if (includedTxHash.toUpperCase() !== txHash.toUpperCase()) {
    subscription.close()
    throwIfAborted(signal)

    options?.eventInclusion?.onFallback?.(
      new GeneralException(
        new Error(
          `Broadcast tx hash ${includedTxHash} did not match subscribed tx hash ${txHash}`,
        ),
      ),
    )

    throwIfAborted(signal)

    return waitForAbortableOperation(
      fetchTxPoll(
        createFetchTxPollArgs({
          txHash: includedTxHash,
          timeout,
          options,
          signal,
        }),
      ),
      signal,
    )
  }

  if (inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll) {
    return waitForSubscribedTxInclusionAndPoll({
      txHash,
      timeout,
      fetchTx,
      options,
      fetchTxPoll,
      subscription,
      signal,
    })
  }

  return waitForSubscribedTxInclusion({
    txHash,
    timeout,
    options,
    fetchTx,
    subscription,
    fetchTxPoll,
    createRequestException,
    signal,
  })
}

function createFetchTxPollArgs({
  txHash,
  timeout,
  options,
  signal,
}: Pick<PrepareTxInclusionWaiterArgs, 'txHash' | 'timeout' | 'options'> & {
  signal?: AbortSignal
}): TxFetchTxPollArgs & { timeout: number } {
  return {
    ...(options?.pollingInterval === undefined
      ? {}
      : { pollingInterval: options.pollingInterval }),
    ...(signal ? { abortSignal: signal } : {}),
    txHash,
    timeout,
  }
}

async function waitForSubscribedTxInclusion({
  txHash,
  timeout,
  options,
  fetchTx,
  fetchTxPoll,
  subscription,
  createRequestException,
  signal,
}: PrepareTxInclusionWaiterArgs & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
  signal: AbortSignal
}): Promise<TxResponse> {
  const fallbackToPolling = options?.eventInclusion?.fallbackToPolling !== false

  try {
    return await waitForSubscribedTxEvent({
      txHash,
      subscription,
      fetchTx,
      signal,
    })
  } catch (e: unknown) {
    if (isLocalCancellation(e, signal)) {
      normalizeInclusionCancellation(e, signal)

      throw e
    }

    if (e instanceof TransactionException) {
      throw e
    }

    const error =
      e instanceof GeneralException
        ? e
        : new GeneralException(new Error(String(e)))

    throwIfAborted(signal)

    if (!fallbackToPolling) {
      throw createRequestException(error, 'event-inclusion')
    }

    options?.eventInclusion?.onFallback?.(error)
    throwIfAborted(signal)

    return waitForAbortableOperation(
      fetchTxPoll(createFetchTxPollArgs({ txHash, timeout, options, signal })),
      signal,
    )
  }
}

async function waitForSubscribedTxInclusionAndPoll({
  txHash,
  timeout,
  options,
  fetchTx,
  fetchTxPoll,
  subscription,
  signal,
}: Omit<PrepareTxInclusionWaiterArgs, 'createRequestException'> & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
  signal: AbortSignal
}): Promise<TxResponse> {
  const pollController = new AbortController()
  const eventController = new AbortController()
  const pollSignals = combineAbortSignals([signal, pollController.signal])
  const eventSignals = combineAbortSignals([signal, eventController.signal])

  return new Promise<TxResponse>((resolve, reject) => {
    let settled = false
    let finishedCount = 0

    let eventError: Error | undefined
    let pollError: Error | undefined

    const cleanup = () => {
      signal.removeEventListener('abort', onAbort)
      pollSignals.dispose()
      eventSignals.dispose()
    }

    const rejectIfBothFailed = () => {
      if (finishedCount < 2 || settled) {
        return
      }

      finishReject(
        pollError ||
          eventError ||
          new GeneralException(new Error('Tx inclusion failed')),
      )
    }

    const finishResolve = (
      txResponse: TxResponse,
      source: 'event' | 'poll',
    ) => {
      if (settled) {
        return
      }

      settled = true

      if (source === 'poll') {
        eventController.abort()
        subscription.close()
      } else {
        pollController.abort()
        subscription.close()
      }

      cleanup()
      resolve(txResponse)
    }

    const finishReject = (error: Error) => {
      if (settled) {
        return
      }

      settled = true
      pollController.abort()
      eventController.abort()
      subscription.close()
      cleanup()
      reject(error)
    }

    const onAbort = () => {
      finishReject(createAbortError(signal))
    }

    signal.addEventListener('abort', onAbort, { once: true })

    if (signal.aborted) {
      onAbort()

      return
    }

    const failBranch = (source: 'event' | 'poll', error: unknown) => {
      if (settled) {
        return
      }

      if (isLocalCancellation(error, signal)) {
        finishReject(
          signal.aborted
            ? createAbortError(signal)
            : error instanceof Error
              ? error
              : createAbortError(signal),
        )

        return
      }

      if (error instanceof TransactionException) {
        finishReject(error)

        return
      }

      const branchError =
        error instanceof Error ? error : new Error(String(error))

      if (source === 'event') {
        eventError = branchError

        if (!signal.aborted) {
          try {
            options?.eventInclusion?.onFallback?.(branchError)
          } catch (callbackError: unknown) {
            // This callback runs from a detached `.catch` branch, so a thrown
            // callback error must settle the observation instead of becoming an
            // unhandled rejection and leaving the parent wait pending forever.
            finishReject(
              callbackError instanceof Error
                ? callbackError
                : new Error(String(callbackError)),
            )

            return
          }
        }
      } else {
        pollError = branchError
      }

      finishedCount += 1
      rejectIfBothFailed()
    }

    waitForSubscribedTxEvent({
      txHash,
      subscription,
      fetchTx,
      signal: eventSignals.signal as AbortSignal,
    })
      .then((txResponse) => finishResolve(txResponse, 'event'))
      .catch((error: unknown) => failBranch('event', error))

    fetchTxPoll(
      createFetchTxPollArgs({
        txHash,
        timeout,
        options,
        signal: pollSignals.signal as AbortSignal,
      }),
    )
      .then((txResponse) => finishResolve(txResponse, 'poll'))
      .catch((error: unknown) => failBranch('poll', error))
  })
}

async function waitForSubscribedTxEvent({
  txHash,
  fetchTx,
  subscription,
  signal,
}: Pick<PrepareTxInclusionWaiterArgs, 'txHash' | 'fetchTx'> & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
  signal: AbortSignal
}): Promise<TxResponse> {
  const eventTx = await waitForAbortableOperation(subscription.wait(), signal)

  if (eventTx.code !== 0) {
    throw new TransactionException(new Error(eventTx.rawLog), {
      contextCode: eventTx.code,
      contextModule: eventTx.codespace,
    })
  }

  throwIfAborted(signal)

  return waitForAbortableOperation(fetchTx(txHash, { signal }), signal)
}
