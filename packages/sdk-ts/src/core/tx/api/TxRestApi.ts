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
  sleep,
  HttpClient,
  toBigNumber,
  DEFAULT_TX_POLL_INTERVAL_MS,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
  DEFAULT_TX_POLL_CALL_TIMEOUT_MS,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
} from '@injectivelabs/utils'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import { BroadcastMode } from '../types/tx-rest-client.js'
import { getErrorMessage } from '../../../utils/helpers.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import type { AxiosError } from 'axios'
import type { TxResponse } from '../types/tx.js'
import type {
  TxInfoResponse,
  TxResultResponse,
  SimulationResponse,
} from '../types/tx-rest-client.js'
import type {
  TxConcreteApi,
  TxInclusionWaiter,
  TxClientBroadcastOptions,
  TxClientInclusionOptions,
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

  public async fetchTx(txHash: string, params: any = {}): Promise<TxResponse> {
    try {
      const response = await this.getRaw<TxResultResponse>(
        `/cosmos/tx/v1beta1/txs/${txHash}`,
        params,
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
    }
  }

  public async fetchTxPoll(
    txHash: string,
    timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
  ): Promise<TxResponse> {
    const deadline = Date.now() + timeout

    for (let start = Date.now(); start < deadline; start = Date.now()) {
      const callTimeout = Math.max(
        0,
        Math.min(DEFAULT_TX_POLL_CALL_TIMEOUT_MS, deadline - Date.now()),
      )

      try {
        const txResponse = await Promise.race([
          this.fetchTx(txHash),
          sleep(callTimeout).then(() => null as TxResponse | null),
        ])

        if (txResponse) {
          return txResponse
        }
      } catch (e: unknown) {
        if (e instanceof TransactionException) {
          throw e
        }
      }

      const elapsed = Date.now() - start
      const remaining = DEFAULT_TX_POLL_INTERVAL_MS - elapsed

      if (remaining > 0) {
        await sleep(remaining)
      }
    }

    throw new HttpRequestException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      {
        context: `/cosmos/tx/v1beta1/txs/${txHash}`,
        contextModule: 'TxRestApi.fetch-tx-poll',
      },
    )
  }

  public async waitForTxInclusion(
    txHash: string,
    timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
    options?: TxClientInclusionOptions,
  ): Promise<TxResponse> {
    const waiter = await this.prepareTxInclusionWait(txHash, timeout, options)

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
    txHash: string,
    timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
    options?: TxClientInclusionOptions,
  ): Promise<TxInclusionWaiter> {
    const inclusionStrategy = options?.inclusionStrategy

    if (!this.isTendermintEventStrategy(inclusionStrategy)) {
      return this.createPollingInclusionWaiter(txHash, timeout)
    }

    const eventOptions = options?.eventInclusion
    const rpcEndpoint = eventOptions?.rpcEndpoint
    const fallbackToPolling = eventOptions?.fallbackToPolling !== false

    if (!rpcEndpoint) {
      const error = new Error(
        'Tendermint RPC endpoint is required for event inclusion',
      )

      if (!fallbackToPolling) {
        throw new HttpRequestException(error, {
          context: 'TxRestApi',
          contextModule: 'event-inclusion',
        })
      }

      eventOptions?.onFallback?.(error)

      return this.createPollingInclusionWaiter(txHash, timeout)
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
              new Error(
                `Broadcast tx hash ${includedTxHash} did not match subscribed tx hash ${txHash}`,
              ),
            )
            return this.fetchTxPoll(includedTxHash, timeout)
          }

          if (
            inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll
          ) {
            return this.waitForSubscribedTxInclusionAndPoll(
              txHash,
              timeout,
              subscription,
              options,
            )
          }

          return this.waitForSubscribedTxInclusion(
            txHash,
            timeout,
            subscription,
            options,
          )
        },
      }
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      const error = e instanceof Error ? e : new Error(String(e))

      if (!fallbackToPolling) {
        throw new HttpRequestException(error, {
          context: 'TxRestApi',
          contextModule: 'event-inclusion',
        })
      }

      eventOptions?.onFallback?.(error)

      return this.createPollingInclusionWaiter(txHash, timeout)
    }
  }

  private isTendermintEventStrategy(inclusionStrategy?: TxInclusionStrategy) {
    return (
      inclusionStrategy === TxInclusionStrategy.TendermintEvent ||
      inclusionStrategy === TxInclusionStrategy.TendermintEventAndPoll
    )
  }

  private createPollingInclusionWaiter(
    txHash: string,
    timeout: number,
  ): TxInclusionWaiter {
    return {
      txHash,
      inclusionStrategy: TxInclusionStrategy.Poll,
      close: () => {},
      wait: (includedTxHash = txHash) =>
        this.fetchTxPoll(includedTxHash, timeout),
    }
  }

  public async simulate(txRaw: CosmosTxV1Beta1TxPb.TxRaw) {
    const txRawClone = CosmosTxV1Beta1TxPb.TxRaw.create({ ...txRaw })

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    try {
      const response = await this.postRaw<SimulationResponse>(
        '/cosmos/tx/v1beta1/simulate',
        {
          tx_bytes: TxClient.encode(txRawClone),
        },
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
      throw new TransactionException(e as Error, { skipParsing: true })
    }
  }

  public async broadcast(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxResponse> {
    const timeout =
      options?.timeout ||
      toBigNumber(options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT)
        .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
        .toNumber()
    const txHash = TxClient.hash(txRaw)
    let inclusionWaiter: TxInclusionWaiter | undefined

    try {
      inclusionWaiter = await this.prepareTxInclusionWait(
        txHash,
        timeout,
        options,
      )

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

      if (options?.onBroadcast) {
        options.onBroadcast(txResponse.txhash)
      }

      const result = await inclusionWaiter.wait(txResponse.txhash)

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
    } catch (e: unknown) {
      inclusionWaiter?.close()

      if (e instanceof HttpRequestException) {
        if (e.code !== StatusCodes.OK) {
          throw e
        }
      }

      throw e
    }
  }

  private async waitForSubscribedTxInclusion(
    txHash: string,
    timeout: number,
    subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>,
    options?: TxClientInclusionOptions,
  ): Promise<TxResponse> {
    const fallbackToPolling =
      options?.eventInclusion?.fallbackToPolling !== false

    try {
      return await this.waitForSubscribedTxEvent(txHash, subscription)
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      const error = e instanceof Error ? e : new Error(String(e))

      if (!fallbackToPolling) {
        throw new HttpRequestException(error, {
          context: 'TxRestApi',
          contextModule: 'event-inclusion',
        })
      }

      options?.eventInclusion?.onFallback?.(error)

      return this.fetchTxPoll(txHash, timeout)
    }
  }

  private async waitForSubscribedTxInclusionAndPoll(
    txHash: string,
    timeout: number,
    subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>,
    options?: TxClientInclusionOptions,
  ): Promise<TxResponse> {
    return new Promise<TxResponse>((resolve, reject) => {
      let settled = false
      let finishedCount = 0
      let eventError: Error | undefined
      let pollError: Error | undefined

      const rejectIfBothFailed = () => {
        if (finishedCount < 2 || settled) {
          return
        }

        reject(pollError || eventError || new Error('Tx inclusion failed'))
      }

      const resolveOnce = (
        txResponse: TxResponse,
        source: 'event' | 'poll',
      ) => {
        if (settled) {
          return
        }

        settled = true

        if (source === 'poll') {
          subscription.close()
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
          reject(error)

          return true
        }

        return false
      }

      this.waitForSubscribedTxEvent(txHash, subscription)
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

      this.fetchTxPoll(txHash, timeout)
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

  private async waitForSubscribedTxEvent(
    txHash: string,
    subscription: Awaited<ReturnType<typeof subscribeToTendermintTxEvent>>,
  ): Promise<TxResponse> {
    const eventTx = await subscription.wait()

    if (eventTx.code !== 0) {
      throw new TransactionException(new Error(eventTx.rawLog), {
        contextCode: eventTx.code,
        contextModule: eventTx.codespace,
      })
    }

    return this.fetchTx(txHash)
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
  ): Promise<T> {
    try {
      return await this.httpClient
        .get<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

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
  ): Promise<T> {
    try {
      return await this.httpClient
        .post<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

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
