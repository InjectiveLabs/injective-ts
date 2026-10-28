import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import * as CosmosTxV1Beta1ServicePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb'
import {
  GeneralException,
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ServiceClient as CosmosTxV1Beta1ServicePbClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb.client'
import {
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
import { prepareTxInclusionWaiter } from './TxInclusion.js'
import { TxObservationAbortError } from './TxObservationAbortError.js'
import BaseGrpcConsumer from '../../../client/base/BaseGrpcConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { TxResponse } from '../types/tx.js'
import type { TxFetchDualArgs } from './types.js'
import type {
  TxConcreteApi,
  TxInclusionWaiter,
  TxFetchTxPollArgs,
  TxClientBroadcastOptions,
  TxWaitForTxInclusionArgs,
  TxClientBroadcastResponse,
  TxPrepareTxInclusionWaitArgs,
} from '../types/tx.js'

export class TxGrpcApi extends BaseGrpcConsumer implements TxConcreteApi {
  protected module: string = 'TxGrpcApi'

  private get client() {
    return this.initClient(CosmosTxV1Beta1ServicePbClient)
  }

  public async fetchTx(
    hash: string,
    options?: RequestOptions,
    /**
     * Supports the common `TxConcreteApi` shape where implementations that
     * keep a positional params argument append options third.
     */
    requestOptions?: RequestOptions,
  ): Promise<TxResponse> {
    const cancellation = combineAbortSignals([
      options?.signal,
      requestOptions?.signal,
    ])
    const signal = cancellation.signal
    const request = CosmosTxV1Beta1ServicePb.GetTxRequest.create()
    request.hash = hash

    try {
      throwIfAborted(signal)

      const response = await raceWithAbort(
        this.executeGrpcCall<
          CosmosTxV1Beta1ServicePb.GetTxRequest,
          CosmosTxV1Beta1ServicePb.GetTxResponse
        >(request, this.client.getTx.bind(this.client), { signal }),
        signal,
      )

      const txResponse = response.txResponse

      if (!txResponse) {
        throw new GrpcUnaryRequestException(
          new Error(`The transaction with ${hash} is not found`),
          {
            context: 'TxGrpcApi',
            contextModule: 'fetch-tx',
          },
        )
      }

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.rawLog), {
          contextCode: Number(txResponse.code),
          contextModule: txResponse.codespace,
        })
      }

      return {
        ...txResponse,
        height: Number(txResponse.height),
        gasWanted: Number(txResponse.gasWanted),
        gasUsed: Number(txResponse.gasUsed),
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

      // Re-throw GrpcUnaryRequestException from executeGrpcCall
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      // Unexpected error
      throw new GrpcUnaryRequestException(
        new Error('There was an issue while fetching transaction details'),
        {
          context: 'TxGrpcApi',
          contextModule: 'fetch-tx',
        },
      )
    } finally {
      cancellation.dispose()
    }
  }

  public async fetchTxPoll(
    {
      txHash,
      abortSignal,
      signal,
      timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
      pollingInterval = DEFAULT_TX_POLL_INTERVAL_MS,
    }: TxFetchTxPollArgs,
    options?: RequestOptions,
  ): Promise<TxResponse> {
    const observationSignals = combineAbortSignals([
      this.options?.abort,
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

        try {
          const tx = await this.fetchTxDual({
            txHash,
            deadline,
            abortSignal: observationSignal,
          })

          throwIfAborted(observationSignal)

          if (tx) {
            return tx
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

        const gap = pollingInterval - (Date.now() - start)
        const untilDeadline = deadline - Date.now()
        const wait = Math.max(0, Math.min(gap, untilDeadline))

        if (wait > 0) {
          await abortableSleep(wait, observationSignal)
        }
      }

      throwIfAborted(observationSignal)

      throw new GrpcUnaryRequestException(
        new Error(
          `Transaction was not included in a block before timeout of ${timeout}ms`,
        ),
        { context: 'TxGrpcApi', contextModule: 'fetch-tx-poll' },
      )
    } finally {
      observationSignals.dispose()
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
    const waiter = requestOptions
      ? await this.prepareTxInclusionWait(prepareArgs, requestOptions)
      : await this.prepareTxInclusionWait(prepareArgs)

    const txResponse = await waiter.wait()

    if (!txResponse) {
      throw new GrpcUnaryRequestException(
        new Error(`The transaction with ${txHash} is not found`),
        {
          context: 'TxGrpcApi',
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
    return prepareTxInclusionWaiter({
      txHash,
      timeout,
      options,
      signal,
      abortSignal,
      requestOptions,
      clientSignal: this.options?.abort,
      fetchTx: (includedTxHash, fetchOptions) =>
        this.fetchTx(includedTxHash, fetchOptions),
      fetchTxPoll: (args) => this.fetchTxPoll(args),
      createRequestException: (error, contextModule) =>
        new GrpcUnaryRequestException(error, {
          context: 'TxGrpcApi',
          contextModule,
        }),
    })
  }

  /**
   * Runs two staggered observations using the baseline Promise.all semantics:
   * both branches settle, the first branch result is preferred (`a ?? b`), and
   * a TransactionException from either branch fails the attempt even when the
   * other branch already succeeded.
   *
   * Cancellation is separate from result selection: a fresh attempt controller
   * aborts both in-flight branches on caller cancellation or the attempt
   * deadline. External abort rejects promptly; the attempt deadline resolves to
   * `null` so the next poll can continue.
   */
  private async fetchTxDual({
    txHash,
    deadline,
    abortSignal,
    signal,
  }: TxFetchDualArgs): Promise<TxResponse | null> {
    throwIfAborted(abortSignal)
    throwIfAborted(signal)

    const STAGGER = 300
    const timeout = Math.max(
      0,
      Math.min(DEFAULT_TX_POLL_CALL_TIMEOUT_MS, deadline - Date.now()),
    )

    if (timeout <= 0) {
      return null
    }

    const attemptController = new AbortController()
    const attemptSignals = combineAbortSignals([
      abortSignal,
      signal,
      attemptController.signal,
    ])
    const attemptSignal = attemptSignals.signal as AbortSignal

    return new Promise<TxResponse | null>((resolve, reject) => {
      const results: Array<TxResponse | null> = [null, null]
      let settled = false
      let finishedCount = 0
      let timer: ReturnType<typeof setTimeout> | undefined

      function cleanup() {
        if (timer !== undefined) {
          clearTimeout(timer)
          timer = undefined
        }

        abortSignal?.removeEventListener('abort', onAbort)
        signal?.removeEventListener('abort', onAbort)
        attemptSignals.dispose()
      }

      function abortAttempt() {
        if (!attemptController.signal.aborted) {
          attemptController.abort()
        }
      }

      function finishNull() {
        if (settled) {
          return
        }

        settled = true
        abortAttempt()
        cleanup()
        resolve(null)
      }

      function finishReject(error: Error) {
        if (settled) {
          return
        }

        settled = true
        abortAttempt()
        cleanup()
        reject(error)
      }

      function finishBranch() {
        finishedCount += 1

        if (finishedCount < 2 || settled) {
          return
        }

        settled = true
        cleanup()
        resolve(results[0] ?? results[1])
      }

      function onAbort() {
        finishReject(createAbortError(abortSignal ?? signal))
      }

      const runBranch = async (index: number) => {
        try {
          if (index === 1) {
            await abortableSleep(STAGGER, attemptSignal)
          }

          throwIfAborted(attemptSignal)

          const tx = await raceWithAbort(
            this.fetchTx(txHash, { signal: attemptSignal }),
            attemptSignal,
          )

          if (settled) {
            return
          }

          results[index] = tx ?? null
          finishBranch()
        } catch (e: unknown) {
          if (settled) {
            return
          }

          if (abortSignal?.aborted || signal?.aborted) {
            finishReject(createAbortError(abortSignal ?? signal))
            return
          }

          if (e instanceof TransactionException) {
            finishReject(e)
            return
          }

          if (isAbortError(e)) {
            finishReject(
              e instanceof Error ? e : createAbortError(attemptSignal),
            )

            return
          }

          results[index] = null
          finishBranch()
        }
      }

      abortSignal?.addEventListener('abort', onAbort, { once: true })
      signal?.addEventListener('abort', onAbort, { once: true })

      if (abortSignal?.aborted || signal?.aborted) {
        onAbort()

        return
      }

      timer = setTimeout(() => {
        finishNull()
      }, timeout)

      void runBranch(0)
      void runBranch(1)
    })
  }

  public async simulate(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: RequestOptions,
  ) {
    const signal = options?.signal
    const txRawClone = CosmosTxV1Beta1TxPb.TxRaw.create({ ...txRaw })
    const simulateRequest = CosmosTxV1Beta1ServicePb.SimulateRequest.create()

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    simulateRequest.txBytes = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRawClone)

    try {
      throwIfAborted(signal)

      const response = await raceWithAbort(
        this.executeGrpcCall<
          CosmosTxV1Beta1ServicePb.SimulateRequest,
          CosmosTxV1Beta1ServicePb.SimulateResponse
        >(simulateRequest, this.client.simulate.bind(this.client), { signal }),
        signal,
      )

      const result = {
        ...response.result,
        data: response.result?.data || '',
        log: response.result?.log || '',
        eventsList: response.result?.events || [],
      }
      const gasInfo = {
        ...response.gasInfo,
        gasWanted: response.gasInfo ? Number(response.gasInfo.gasWanted) : 0,
        gasUsed: response.gasInfo ? Number(response.gasInfo.gasUsed) : 0,
      }

      return {
        result: result,
        gasInfo: gasInfo,
      }
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }

      if (signal?.aborted) {
        throw createAbortError(signal)
      }

      throw new TransactionException(e as Error, {
        context: 'TxGrpcApi.simulate',
        skipParsing: true,
      })
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
    let txHash = TxClient.hash(txRaw)
    let broadcastCompleted = false
    let inclusionWaiter: TxInclusionWaiter | undefined

    try {
      const prepareArgs = {
        txHash,
        timeout,
        options,
        signal: options?.signal,
      }
      inclusionWaiter = requestOptions
        ? await this.prepareTxInclusionWait(prepareArgs, requestOptions)
        : await this.prepareTxInclusionWait(prepareArgs)

      const mode =
        options?.mode ||
        (inclusionWaiter.inclusionStrategy !== TxInclusionStrategy.Poll
          ? CosmosTxV1Beta1ServicePb.BroadcastMode.ASYNC
          : CosmosTxV1Beta1ServicePb.BroadcastMode.SYNC)
      const broadcastTxRequest =
        CosmosTxV1Beta1ServicePb.BroadcastTxRequest.create()
      broadcastTxRequest.txBytes = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw)
      broadcastTxRequest.mode = mode as CosmosTxV1Beta1ServicePb.BroadcastMode

      const response = await this.executeGrpcCall<
        CosmosTxV1Beta1ServicePb.BroadcastTxRequest,
        CosmosTxV1Beta1ServicePb.BroadcastTxResponse
      >(broadcastTxRequest, this.client.broadcastTx.bind(this.client))

      const txResponse = response.txResponse

      if (!txResponse) {
        throw new GrpcUnaryRequestException(
          new Error(`The transaction has failed to be broadcasted`),
          {
            context: 'TxGrpcApi.broadcast',
            contextModule: 'broadcast',
          },
        )
      }

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.rawLog), {
          contextCode: Number(txResponse.code),
          contextModule: txResponse.codespace,
        })
      }

      txHash = txResponse.txhash || txHash
      broadcastCompleted = true

      if (options?.onBroadcast) {
        options.onBroadcast(txResponse.txhash)
      }

      const result = await inclusionWaiter.wait(txResponse.txhash)

      if (!result) {
        throw new GrpcUnaryRequestException(
          new Error(`The transaction with ${txResponse.txhash} is not found`),
          {
            context: 'TxGrpcApi.broadcast',
            contextModule: 'wait-for-tx-inclusion',
          },
        )
      }

      return result
    } catch (e: unknown) {
      inclusionWaiter?.close()

      // Preparation can be cancelled before the mutation is sent. Only attach
      // a recovery hash once broadcast has completed successfully.
      if (isAbortError(e)) {
        if (!broadcastCompleted) {
          throw e
        }

        throw new TxObservationAbortError(
          txHash,
          (e as { reason?: unknown }).reason,
        )
      }

      if (e instanceof TransactionException) {
        throw e
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new TransactionException(new Error(e as any))
    }
  }

  /** @deprecated - the BLOCK mode broadcasting is deprecated now, use either sync or async */
  public async broadcastBlock(txRaw: CosmosTxV1Beta1TxPb.TxRaw) {
    const broadcastTxRequest =
      CosmosTxV1Beta1ServicePb.BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw)
    broadcastTxRequest.mode = CosmosTxV1Beta1ServicePb.BroadcastMode
      .BLOCK as CosmosTxV1Beta1ServicePb.BroadcastMode

    try {
      const response = await this.executeGrpcCall<
        CosmosTxV1Beta1ServicePb.BroadcastTxRequest,
        CosmosTxV1Beta1ServicePb.BroadcastTxResponse
      >(broadcastTxRequest, this.client.broadcastTx.bind(this.client))

      const txResponse = response.txResponse

      if (!txResponse) {
        throw new GeneralException(
          new Error('There was an issue broadcasting the transaction'),
        )
      }

      const result: TxClientBroadcastResponse = {
        ...txResponse,
        height: Number(txResponse.height),
        gasWanted: Number(txResponse.gasWanted),
        gasUsed: Number(txResponse.gasUsed),
        txHash: txResponse.txhash,
      }

      if (result.code !== 0) {
        throw new TransactionException(new Error(result.rawLog), {
          contextCode: result.code,
          contextModule: result.codespace,
        })
      }

      return result as TxClientBroadcastResponse
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error(e as any))
    }
  }
}
