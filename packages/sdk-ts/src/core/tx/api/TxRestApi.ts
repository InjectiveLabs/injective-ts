import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import {
  HttpRequestMethod,
  HttpRequestException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  HttpClient,
  toBigNumber,
  isAbortError,
  raceWithAbort,
  abortableSleep,
  throwIfAborted,
  createAbortError,
  combineAbortSignals,
  DEFAULT_TX_POLL_INTERVAL_MS,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
  DEFAULT_TX_POLL_CALL_TIMEOUT_MS,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
} from '@injectivelabs/utils'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import { fetchTxWithAttemptTimeout } from './TxPoll.js'
import { observeTx } from './TxObservationAbortError.js'
import { BroadcastMode } from '../types/tx-rest-client.js'
import { getErrorMessage } from '../../../utils/helpers.js'
import {
  getTxObservationSignals,
  prepareTxInclusionWaiter,
} from './TxInclusion.js'
import type { AxiosError } from 'axios'
import type { RequestOptions } from '@injectivelabs/utils'
import type { TxResponse } from '../types/tx.js'
import type {
  TxInfoResponse,
  TxResultResponse,
  SimulationResponse,
} from '../types/tx-rest-client.js'
import type {
  TxConcreteApi,
  TxInclusionWaiter,
  TxFetchTxPollArgs,
  TxClientBroadcastOptions,
  TxWaitForTxInclusionArgs,
  TxPrepareTxInclusionWaitArgs,
} from '../types/tx.js'

/**
 * It is recommended to use TxGrpcClient instead of TxRestApi
 */
export class TxRestApi implements TxConcreteApi {
  public httpClient: HttpClient

  constructor(endpoint: string, options?: { timeout?: number }) {
    this.httpClient = new HttpClient(endpoint, {
      headers: {
        Accept: 'application/json',
      },
      timeout: options?.timeout || 15000,
    })
  }

  public async fetchTx(
    txHash: string,
    params: any = {},
    options?: RequestOptions,
  ): Promise<TxResponse> {
    const cancellation = this.httpClient.getAbortSignal(options?.signal)
    const signal = cancellation.signal

    try {
      throwIfAborted(signal)

      const response = await raceWithAbort(
        this.getRaw<TxResultResponse>(
          `/cosmos/tx/v1beta1/txs/${txHash}`,
          params,
          { signal },
        ),
        signal,
      )

      const { tx_response: txResponse } = response

      if (!txResponse) {
        throw new HttpRequestException(
          new Error(`The transaction with ${txHash} is not found`),
          {
            context: `/cosmos/tx/v1beta1/txs/${txHash}`,
            contextModule: 'TxRestApi.fetch-tx',
          },
        )
      }

      if (parseInt(txResponse.code.toString(), 10) !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return {
        ...txResponse,
        rawLog: txResponse.raw_log,
        gasWanted: parseInt(txResponse.gas_wanted, 10),
        gasUsed: parseInt(txResponse.gas_used, 10),
        height: parseInt(txResponse.height, 10),
        txHash: txResponse.txhash,
      }
    } catch (e: unknown) {
      // Local cancellation is not a transportation or transaction failure
      if (isAbortError(e)) {
        throw e
      }

      if (signal?.aborted) {
        throw createAbortError(signal)
      }

      // Transaction has failed on the chain
      if (e instanceof TransactionException) {
        throw e
      }

      // Failed to query the transaction on the chain
      if (e instanceof HttpRequestException) {
        throw e
      }

      // The response itself failed
      throw new HttpRequestException(
        new Error('There was an issue while fetching transaction details'),
        {
          context: `/cosmos/tx/v1beta1/txs/${txHash}`,
          contextModule: 'TxRestApi.fetch-tx',
        },
      )
    } finally {
      cancellation.dispose()
    }
  }

  public async fetchTxPoll(
    {
      txHash,
      timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
      pollingInterval = DEFAULT_TX_POLL_INTERVAL_MS,
      abortSignal,
      signal,
    }: TxFetchTxPollArgs,
    options?: RequestOptions,
  ): Promise<TxResponse> {
    const clientCancellation = this.httpClient.getAbortSignal()
    const observationSignals = combineAbortSignals([
      clientCancellation.signal,
      abortSignal,
      signal,
      options?.signal,
    ])
    const observationSignal = observationSignals.signal
    const deadline = Date.now() + timeout

    try {
      throwIfAborted(observationSignal)

      for (let start = Date.now(); start < deadline; start = Date.now()) {
        throwIfAborted(observationSignal)

        const callTimeout = Math.max(
          0,
          Math.min(DEFAULT_TX_POLL_CALL_TIMEOUT_MS, deadline - Date.now()),
        )

        try {
          const txResponse = await fetchTxWithAttemptTimeout({
            txHash,
            timeout: callTimeout,
            signal: observationSignal,
            fetchTx: (includedTxHash, fetchOptions) =>
              this.fetchTx(includedTxHash, undefined, fetchOptions),
          })

          throwIfAborted(observationSignal)

          if (txResponse) {
            return txResponse
          }
        } catch (e: unknown) {
          if (isAbortError(e)) {
            throw e
          }

          if (observationSignal?.aborted) {
            throw createAbortError(observationSignal)
          }

          if (e instanceof TransactionException) {
            throw e
          }
        }

        throwIfAborted(observationSignal)

        const elapsed = Date.now() - start
        const remaining = pollingInterval - elapsed
        const untilDeadline = deadline - Date.now()
        const wait = Math.max(0, Math.min(remaining, untilDeadline))

        if (wait > 0) {
          await abortableSleep(wait, observationSignal)
        }
      }

      throwIfAborted(observationSignal)

      throw new HttpRequestException(
        new Error(
          `Transaction was not included in a block before timeout of ${timeout}ms`,
        ),
        {
          context: `/cosmos/tx/v1beta1/txs/${txHash}`,
          contextModule: 'TxRestApi.fetch-tx-poll',
        },
      )
    } finally {
      observationSignals.dispose()
      clientCancellation.dispose()
    }
  }

  public async waitForTxInclusion(
    {
      txHash,
      timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
      options,
      signal,
      abortSignal,
    }: TxWaitForTxInclusionArgs,
    requestOptions?: RequestOptions,
  ): Promise<TxResponse> {
    const prepareArgs = {
      txHash,
      timeout,
      options,
      signal,
      abortSignal,
    }
    const waiter = await this.prepareTxInclusionWait(
      prepareArgs,
      requestOptions,
    )

    const txResponse = await waiter.wait()

    if (!txResponse) {
      throw new HttpRequestException(
        new Error(`The transaction with ${txHash} is not found`),
        {
          context: 'TxRestApi',
          contextModule: 'wait-for-tx-inclusion',
        },
      )
    }

    return txResponse
  }

  public async prepareTxInclusionWait(
    {
      txHash,
      timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
      options,
      signal,
      abortSignal,
    }: TxPrepareTxInclusionWaitArgs,
    requestOptions?: RequestOptions,
  ): Promise<TxInclusionWaiter> {
    const clientCancellation = this.httpClient.getAbortSignal()

    return prepareTxInclusionWaiter({
      txHash,
      timeout,
      options,
      signal,
      abortSignal,
      requestOptions,
      clientSignal: clientCancellation.signal,
      disposeClientSignal: clientCancellation.dispose,
      fetchTx: (includedTxHash, fetchOptions) =>
        this.fetchTx(includedTxHash, undefined, fetchOptions),
      fetchTxPoll: (args) => this.fetchTxPoll(args),
      createRequestException: (error, contextModule) =>
        new HttpRequestException(error, {
          context: 'TxRestApi',
          contextModule,
        }),
    })
  }

  public async simulate(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: RequestOptions,
  ) {
    const txRawClone = CosmosTxV1Beta1TxPb.TxRaw.create({ ...txRaw })

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    const cancellation = this.httpClient.getAbortSignal(options?.signal)
    const signal = cancellation.signal

    try {
      throwIfAborted(signal)

      const response = await raceWithAbort(
        this.postRaw<SimulationResponse>(
          '/cosmos/tx/v1beta1/simulate',
          {
            tx_bytes: TxClient.encode(txRawClone),
          },
          { signal },
        ),
        signal,
      )

      return {
        result: {
          data: response.result.data,
          log: response.result.log,
          eventsList: response.result.events,
        },
        gasInfo: {
          gasWanted: parseInt(response.gas_info.gas_wanted, 10),
          gasUsed: parseInt(response.gas_info.gas_used, 10),
        },
      }
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }

      if (signal?.aborted) {
        throw createAbortError(signal)
      }

      throw new TransactionException(e as Error, { skipParsing: true })
    } finally {
      cancellation.dispose()
    }
  }

  public async broadcast(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: TxClientBroadcastOptions,
    /**
     * Observation-only cancellation for the inclusion wait. The broadcast
     * mutation itself is deliberately not cancelled by this signal.
     */
    requestOptions?: RequestOptions,
  ): Promise<TxResponse> {
    const timeout =
      options?.timeout ||
      toBigNumber(options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT)
        .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
        .toNumber()
    const txHash = TxClient.hash(txRaw)
    let inclusionWaiter: TxInclusionWaiter | undefined
    const clientCancellation = this.httpClient.getAbortSignal()
    // Existing custom implementations of the public waiter API need not
    // expose a signal, so the pre-submission barrier owns its own scope.
    const observationSignals = combineAbortSignals([
      clientCancellation.signal,
      ...getTxObservationSignals(options, requestOptions),
    ])

    try {
      const prepareArgs = {
        txHash,
        timeout,
        options,
        signal: options?.signal,
      }
      const waiter = await this.prepareTxInclusionWait(
        prepareArgs,
        requestOptions,
      )
      inclusionWaiter = waiter

      // Preparation yields even for polling. Cancellation in that gap must
      // prevent submission, without cancelling a mutation already in flight.
      throwIfAborted(observationSignals.signal)

      const { tx_response: txResponse } = await this.broadcastTx<{
        tx_response: TxInfoResponse
      }>(
        txRaw,
        inclusionWaiter.inclusionStrategy !== TxInclusionStrategy.Poll
          ? BroadcastMode.Async
          : BroadcastMode.Sync,
      )

      if (!txResponse) {
        throw new HttpRequestException(
          new Error('The transaction has failed to be broadcasted'),
          {
            context: 'TxRestApi.broadcast',
            contextModule: 'broadcast',
          },
        )
      }

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return await observeTx(txResponse.txhash || txHash, async () => {
        options?.onBroadcast?.(txResponse.txhash)

        const result = await waiter.wait(txResponse.txhash)

        if (!result) {
          throw new HttpRequestException(
            new Error(`The transaction with ${txResponse.txhash} is not found`),
            {
              context: 'TxRestApi.broadcast',
              contextModule: 'wait-for-tx-inclusion',
            },
          )
        }

        return result
      })
    } catch (e: unknown) {
      inclusionWaiter?.close()

      throw e
    } finally {
      observationSignals.dispose()
      clientCancellation.dispose()
    }
  }

  /**
   * Broadcast the transaction using the "block" mode, waiting for its inclusion in the blockchain.
   * @param tx transaction to broadcast
   *
   * @deprecated - the BLOCk mode broadcasting is deprecated now, use either sync or async
   */
  public async broadcastBlock(txRaw: CosmosTxV1Beta1TxPb.TxRaw) {
    const response = await this.broadcastTx<{
      tx_response: TxInfoResponse
    }>(txRaw, BroadcastMode.Block)

    try {
      const { tx_response: txResponse } = response

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return {
        txHash: txResponse.txhash,
        rawLog: txResponse.raw_log,
        gasWanted: parseInt(txResponse.gas_wanted || '0', 10),
        gasUsed: parseInt(txResponse.gas_used || '0', 10),
        height: parseInt(txResponse.height || '0', 10),
        logs: txResponse.logs || [],
        code: txResponse.code,
        codespace: txResponse.codespace,
        data: txResponse.data,
        info: txResponse.info,
        timestamp: txResponse.timestamp || '0',
      }
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error(e as any))
    }
  }

  private async broadcastTx<T>(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    mode: BroadcastMode = BroadcastMode.Sync,
  ): Promise<T> {
    const response = await this.postRaw<T>('cosmos/tx/v1beta1/txs', {
      tx_bytes: TxClient.encode(txRaw),
      mode,
    })

    return response
  }

  private async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
    options?: RequestOptions,
  ): Promise<T> {
    try {
      return await this.httpClient
        .get<URLSearchParams | any, { data: T }>(endpoint, params, {
          signal: options?.signal,
        })
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (isAbortError(error)) {
        throw error
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpRequestException(new Error(error.message), {
            code: StatusCodes.REQUEST_TOO_LONG,
            context: endpoint,
          })
        }

        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          context: endpoint,
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        context: endpoint,
        code: UnspecifiedErrorCode,
      })
    }
  }

  private async postRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
    options?: RequestOptions,
  ): Promise<T> {
    try {
      const request = options?.signal
        ? this.httpClient.post<URLSearchParams | any, { data: T }>(
            endpoint,
            params,
            { signal: options.signal },
          )
        : this.httpClient.post<URLSearchParams | any, { data: T }>(
            endpoint,
            params,
          )

      return await request.then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (isAbortError(error)) {
        throw error
      }

      if (axios.isAxiosError(error)) {
        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          context: endpoint,
          contextModule: HttpRequestMethod.Post,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        context: endpoint,
        contextModule: HttpRequestMethod.Post,
      })
    }
  }
}
