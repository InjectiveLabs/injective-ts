import {
  GeneralException,
  TransactionException,
} from '@injectivelabs/exceptions'
import { TxInclusionStrategy } from '../types/tx.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import type { TxResponse } from '../types/tx.js'
import type {
  TxInclusionWaiter,
  TxClientInclusionOptions,
} from '../types/tx.js'

type TxInclusionRequestExceptionFactory = (
  error: Error,
  contextModule: string,
) => Error

interface PrepareTxInclusionWaiterArgs {
  txHash: string
  timeout: number
  options?: TxClientInclusionOptions
  fetchTx: (txHash: string) => Promise<TxResponse>
  fetchTxPoll: (
    txHash: string,
    timeout: number,
    abortSignal?: AbortSignal,
  ) => Promise<TxResponse>
  createRequestException: TxInclusionRequestExceptionFactory
}

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
    return createPollingInclusionWaiter({ txHash, timeout, fetchTxPoll })
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

    return createPollingInclusionWaiter({ txHash, timeout, fetchTxPoll })
  }

  try {
    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      endpoint: rpcEndpoint,
      timeout: eventOptions?.timeout || timeout,
      webSocketFactory: eventOptions?.webSocketFactory,
    })

    return {
      txHash,
      inclusionStrategy,
      close: subscription.close,
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

          return fetchTxPoll(includedTxHash, timeout)
        }

        if (inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll) {
          return waitForSubscribedTxInclusionAndPoll({
            txHash,
            timeout,
            subscription,
            options,
            fetchTx,
            fetchTxPoll,
          })
        }

        return waitForSubscribedTxInclusion({
          txHash,
          timeout,
          subscription,
          options,
          fetchTx,
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

    return createPollingInclusionWaiter({ txHash, timeout, fetchTxPoll })
  }
}

function createPollingInclusionWaiter({
  txHash,
  timeout,
  fetchTxPoll,
}: Pick<
  PrepareTxInclusionWaiterArgs,
  'txHash' | 'timeout' | 'fetchTxPoll'
>): TxInclusionWaiter {
  return {
    txHash,
    inclusionStrategy: TxInclusionStrategy.Poll,
    close: () => {},
    wait: (includedTxHash = txHash) => fetchTxPoll(includedTxHash, timeout),
  }
}

async function waitForSubscribedTxInclusion({
  txHash,
  timeout,
  subscription,
  options,
  fetchTx,
  fetchTxPoll,
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

    return fetchTxPoll(txHash, timeout)
  }
}

async function waitForSubscribedTxInclusionAndPoll({
  txHash,
  timeout,
  subscription,
  options,
  fetchTx,
  fetchTxPoll,
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
      } else {
        pollAbortController.abort()
      }

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

    fetchTxPoll(txHash, timeout, pollAbortController.signal)
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
  subscription,
  fetchTx,
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
