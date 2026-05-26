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
import BaseGrpcConsumer from '../../../client/base/BaseGrpcConsumer.js'
import type { TxResponse } from '../types/tx.js'
import type {
  TxConcreteApi,
  TxClientBroadcastOptions,
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
    const mode = options?.mode || CosmosTxV1Beta1ServicePb.BroadcastMode.SYNC
    const timeout =
      options?.timeout ||
      toBigNumber(options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT)
        .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
        .toNumber()

    const broadcastTxRequest =
      CosmosTxV1Beta1ServicePb.BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw)
    broadcastTxRequest.mode = mode as CosmosTxV1Beta1ServicePb.BroadcastMode

    try {
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

      const result = await this.fetchTxPoll(txResponse.txhash, timeout)

      return result
    } catch (e: unknown) {
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
