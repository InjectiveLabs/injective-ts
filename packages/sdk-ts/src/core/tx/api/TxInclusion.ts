import {
  GeneralException,
  TransactionException,
} from '@injectivelabs/exceptions'
import { TxInclusionStrategy } from '../types/tx.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import type { PrepareTxInclusionWaiterArgs } from './types.js'
import type {
  TxResponse,
  TxFetchTxPollArgs,
  TxInclusionWaiter,
} from '../types/tx.js'

export function isTendermintEventStrategy(
  inclusionStrategy?: TxInclusionStrategy,
) {
  return (
    inclusionStrategy === TxInclusionStrategy.TendermintEvent ||
    inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll
  )
}

export async function prepareTxInclusionWaiter({
  txHash,
  timeout,
  options,
  fetchTx,
  fetchTxPoll,
  createRequestException,
}: PrepareTxInclusionWaiterArgs): Promise<TxInclusionWaiter> {
  const inclusionStrategy = options?.inclusionStrategy

  if (!isTendermintEventStrategy(inclusionStrategy)) {
    return createPollingInclusionWaiter({
      txHash,
      timeout,
      options,
      fetchTxPoll,
    })
  }

  const eventOptions = options?.eventInclusion
  const rpcEndpoint = eventOptions?.rpcEndpoint
  const fallbackToPolling = eventOptions?.fallbackToPolling !== false

  if (!rpcEndpoint) {
    const error = new GeneralException(
      new Error('Tendermint RPC endpoint is required for event inclusion'),
    )

    if (!fallbackToPolling) {
      throw createRequestException(error, 'event-inclusion')
    }

    eventOptions?.onFallback?.(error)

    return createPollingInclusionWaiter({
      txHash,
      timeout,
      options,
      fetchTxPoll,
    })
  }

  try {
    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      endpoint: rpcEndpoint,
      timeout: eventOptions?.timeout || timeout,
      webSocketFactory: eventOptions?.webSocketFactory,
    })

    const hashMismatchPollAbortController = new AbortController()
    const close = () => {
      hashMismatchPollAbortController.abort()
      subscription.close()
    }

    return {
      txHash,
      inclusionStrategy,
      close,
      wait: async (includedTxHash = txHash) => {
        if (includedTxHash.toUpperCase() !== txHash.toUpperCase()) {
          subscription.close()
          eventOptions?.onFallback?.(
            new GeneralException(
              new Error(
                `Broadcast tx hash ${includedTxHash} did not match subscribed tx hash ${txHash}`,
              ),
            ),
          )

          return fetchTxPoll(
            createFetchTxPollArgs({
              txHash: includedTxHash,
              timeout,
              options,
              abortSignal: hashMismatchPollAbortController.signal,
            }),
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
        })
      },
    }
  } catch (e: unknown) {
    if (e instanceof TransactionException) {
      throw e
    }

    const error = e instanceof Error ? e : new Error(String(e))

    if (!fallbackToPolling) {
      throw createRequestException(error, 'event-inclusion')
    }

    eventOptions?.onFallback?.(error)

    return createPollingInclusionWaiter({
      txHash,
      timeout,
      options,
      fetchTxPoll,
    })
  }
}

function createPollingInclusionWaiter({
  txHash,
  timeout,
  options,
  fetchTxPoll,
}: Pick<
  PrepareTxInclusionWaiterArgs,
  'txHash' | 'timeout' | 'options' | 'fetchTxPoll'
>): TxInclusionWaiter {
  const pollAbortController = new AbortController()

  return {
    txHash,
    inclusionStrategy: TxInclusionStrategy.Poll,
    close: () => {
      pollAbortController.abort()
    },
    wait: (includedTxHash = txHash) =>
      fetchTxPoll(
        createFetchTxPollArgs({
          txHash: includedTxHash,
          timeout,
          options,
          abortSignal: pollAbortController.signal,
        }),
      ),
  }
}

function createFetchTxPollArgs({
  txHash,
  timeout,
  options,
  abortSignal,
}: Pick<PrepareTxInclusionWaiterArgs, 'txHash' | 'timeout' | 'options'> & {
  abortSignal?: AbortSignal
}): TxFetchTxPollArgs & { timeout: number } {
  return {
    ...(options?.pollingInterval === undefined
      ? {}
      : { pollingInterval: options.pollingInterval }),
    ...(abortSignal ? { abortSignal } : {}),
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
}: PrepareTxInclusionWaiterArgs & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
}): Promise<TxResponse> {
  const fallbackToPolling = options?.eventInclusion?.fallbackToPolling !== false

  try {
    return await waitForSubscribedTxEvent({ txHash, subscription, fetchTx })
  } catch (e: unknown) {
    if (e instanceof TransactionException) {
      throw e
    }

    const error =
      e instanceof GeneralException
        ? e
        : new GeneralException(new Error(String(e)))

    if (!fallbackToPolling) {
      throw createRequestException(error, 'event-inclusion')
    }

    options?.eventInclusion?.onFallback?.(error)

    return fetchTxPoll(createFetchTxPollArgs({ txHash, timeout, options }))
  }
}

async function waitForSubscribedTxInclusionAndPoll({
  txHash,
  timeout,
  options,
  fetchTx,
  fetchTxPoll,
  subscription,
}: Omit<PrepareTxInclusionWaiterArgs, 'createRequestException'> & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
}): Promise<TxResponse> {
  const pollAbortController = new AbortController()

  return new Promise<TxResponse>((resolve, reject) => {
    let settled = false
    let finishedCount = 0

    let eventError: Error | undefined
    let pollError: Error | undefined

    const rejectIfBothFailed = () => {
      if (finishedCount < 2 || settled) {
        return
      }

      reject(
        pollError ||
          eventError ||
          new GeneralException(new Error('Tx inclusion failed')),
      )
    }

    const resolveOnce = (txResponse: TxResponse, source: 'event' | 'poll') => {
      if (settled) {
        return
      }

      settled = true

      if (source === 'poll') {
        subscription.close()
        resolve(txResponse)

        return
      }

      pollAbortController.abort()
      resolve(txResponse)
    }

    const rejectTerminal = (error: unknown) => {
      if (settled) {
        return true
      }

      if (error instanceof TransactionException) {
        settled = true
        subscription.close()
        pollAbortController.abort()
        reject(error)

        return true
      }

      return false
    }

    waitForSubscribedTxEvent({ txHash, subscription, fetchTx })
      .then((txResponse) => resolveOnce(txResponse, 'event'))
      .catch((error: unknown) => {
        if (rejectTerminal(error)) {
          return
        }

        const fallbackError =
          error instanceof Error ? error : new Error(String(error))
        eventError = fallbackError
        finishedCount += 1
        options?.eventInclusion?.onFallback?.(fallbackError)
        rejectIfBothFailed()
      })

    fetchTxPoll(
      createFetchTxPollArgs({
        txHash,
        timeout,
        options,
        abortSignal: pollAbortController.signal,
      }),
    )
      .then((txResponse) => resolveOnce(txResponse, 'poll'))
      .catch((error: unknown) => {
        if (rejectTerminal(error)) {
          return
        }

        pollError = error instanceof Error ? error : new Error(String(error))
        finishedCount += 1
        rejectIfBothFailed()
      })
  })
}

async function waitForSubscribedTxEvent({
  txHash,
  fetchTx,
  subscription,
}: Pick<PrepareTxInclusionWaiterArgs, 'txHash' | 'fetchTx'> & {
  subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>
}): Promise<TxResponse> {
  const eventTx = await subscription.wait()

  if (eventTx.code !== 0) {
    throw new TransactionException(new Error(eventTx.rawLog), {
      contextCode: eventTx.code,
      contextModule: eventTx.codespace,
    })
  }

  return fetchTx(txHash)
}
