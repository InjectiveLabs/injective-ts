import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import * as CosmosTxV1Beta1ServicePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb'
import {
  GeneralException,
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ServiceClient as CosmosTxV1Beta1ServicePbClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb.client'
import {
  sleep,
  toBigNumber,
  DEFAULT_TX_POLL_INTERVAL_MS,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
  DEFAULT_TX_POLL_CALL_TIMEOUT_MS,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
} from '@injectivelabs/utils'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import BaseGrpcConsumer from '../../../client/base/BaseGrpcConsumer.js'
import type { TxResponse } from '../types/tx.js'
import type {
  TxConcreteApi,
  TxInclusionWaiter,
  TxClientBroadcastOptions,
  TxClientInclusionOptions,
  TxClientBroadcastResponse,
} from '../types/tx.js'

export class TxGrpcApi extends BaseGrpcConsumer implements TxConcreteApi {
  protected module: string = 'TxGrpcApi'

  private get client() {
    return this.initClient(CosmosTxV1Beta1ServicePbClient)
  }

  public async fetchTx(hash: string): Promise<TxResponse> {
    const request = CosmosTxV1Beta1ServicePb.GetTxRequest.create()
    request.hash = hash

    try {
      const response = await this.executeGrpcCall<
        CosmosTxV1Beta1ServicePb.GetTxRequest,
        CosmosTxV1Beta1ServicePb.GetTxResponse
      >(request, this.client.getTx.bind(this.client))

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
    }
  }

  public async fetchTxPoll(
    txHash: string,
    timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
  ): Promise<TxResponse> {
    const deadline = Date.now() + timeout

    for (let start = Date.now(); start < deadline; start = Date.now()) {
      try {
        const tx = await this.fetchTxDual(txHash, deadline)

        if (tx) {
          return tx
        }
      } catch (e: unknown) {
        if (e instanceof TransactionException) {
          throw e
        }
      }

      const gap = DEFAULT_TX_POLL_INTERVAL_MS - (Date.now() - start)

      if (gap > 0) {
        await sleep(gap)
      }
    }

    throw new GrpcUnaryRequestException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      { context: 'TxGrpcApi', contextModule: 'fetch-tx-poll' },
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
        throw new GrpcUnaryRequestException(error, {
          context: 'TxGrpcApi',
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
        throw new GrpcUnaryRequestException(error, {
          context: 'TxGrpcApi',
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

  private async safeFetchTx(
    txHash: string,
    delay?: number,
  ): Promise<TxResponse | null> {
    if (delay) {
      await sleep(delay)
    }

    return this.fetchTx(txHash).catch((e: unknown) => {
      if (e instanceof TransactionException) {
        throw e
      }

      return null
    })
  }

  private fetchTxDual(
    txHash: string,
    deadline: number,
  ): Promise<TxResponse | null> {
    const STAGGER = 300
    const timeout = Math.max(
      0,
      Math.min(DEFAULT_TX_POLL_CALL_TIMEOUT_MS, deadline - Date.now()),
    )

    const fetches = Promise.all([
      this.safeFetchTx(txHash),
      this.safeFetchTx(txHash, STAGGER),
    ]).then(([a, b]) => a ?? b)

    fetches.catch(() => {})

    return Promise.race([
      fetches,
      sleep(timeout).then(() => null as TxResponse | null),
    ])
  }

  public async simulate(txRaw: CosmosTxV1Beta1TxPb.TxRaw) {
    const txRawClone = CosmosTxV1Beta1TxPb.TxRaw.create({ ...txRaw })
    const simulateRequest = CosmosTxV1Beta1ServicePb.SimulateRequest.create()

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    simulateRequest.txBytes = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRawClone)

    try {
      const response = await this.executeGrpcCall<
        CosmosTxV1Beta1ServicePb.SimulateRequest,
        CosmosTxV1Beta1ServicePb.SimulateResponse
      >(simulateRequest, this.client.simulate.bind(this.client))

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
      throw new TransactionException(e as Error, {
        context: 'TxGrpcApi.simulate',
        skipParsing: true,
      })
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

      if (e instanceof TransactionException) {
        throw e
      }

      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new TransactionException(new Error(e as any))
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
        throw new GrpcUnaryRequestException(error, {
          context: 'TxGrpcApi',
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
