import {
  TxConcreteApi,
  TxClientBroadcastOptions,
  TxClientBroadcastResponse,
} from '../types/tx'
import {
  TransactionException,
  GrpcUnaryRequestException,
  GeneralException,
} from '@injectivelabs/exceptions'
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
} from '@injectivelabs/utils'
import { TxResponse } from '../types/tx'
import BaseGrpcWebConsumer from '../../../client/base/BaseGrpcWebConsumer'
import {
  CosmosTxV1Beta1Service,
  CosmosTxV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'

export class TxGrpcApi implements TxConcreteApi {
  public txService: CosmosTxV1Beta1Service.ServiceClientImpl

  public endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.txService = new CosmosTxV1Beta1Service.ServiceClientImpl(
      BaseGrpcWebConsumer.getGrpcWebImpl(endpoint),
    )
  }

  public async fetchTx(hash: string): Promise<TxResponse> {
    const request = CosmosTxV1Beta1Service.GetTxRequest.create()

    request.hash = hash

    try {
      const response = await this.txService.GetTx(request)

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
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return {
        ...txResponse,
        height: parseInt(txResponse.height, 10),
        gasWanted: parseInt(txResponse.gasWanted, 10),
        gasUsed: parseInt(txResponse.gasUsed, 10),
        txHash: txResponse.txhash,
      }
    } catch (e: unknown) {
      // Transaction has failed on the chain
      if (e instanceof TransactionException) {
        throw e
      }

      // Failed to query the transaction on the chain
      if (e instanceof CosmosTxV1Beta1Service.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
        })
      }

      // The response itself failed
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
    timeout = DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS || 60000,
  ): Promise<TxResponse> {
    const POLL_INTERVAL = DEFAULT_BLOCK_TIME_IN_SECONDS * 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const txResponse = await this.fetchTx(txHash)

        if (txResponse) {
          return txResponse
        }
      } catch (e: unknown) {
        // We throw only if the transaction failed on chain
        if (e instanceof TransactionException) {
          throw e
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    // Transaction was not included in the block in the desired timeout
    throw new GrpcUnaryRequestException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      {
        context: 'TxGrpcApi',
        contextModule: 'fetch-tx-poll',
      },
    )
  }

  public async simulate(txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const { txService } = this

    const txRawClone = CosmosTxV1Beta1Tx.TxRaw.fromPartial({ ...txRaw })
    const simulateRequest = CosmosTxV1Beta1Service.SimulateRequest.create()

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    simulateRequest.txBytes =
      CosmosTxV1Beta1Tx.TxRaw.encode(txRawClone).finish()

    try {
      const response = await txService.Simulate(simulateRequest)

      const result = {
        ...response.result,
        data: response.result ? response.result.data : '',
        log: response.result ? response.result.log : '',
        eventsList: response.result ? response.result.events : [],
      }
      const gasInfo = {
        ...response.gasInfo,
        gasWanted: response.gasInfo
          ? parseInt(response.gasInfo.gasWanted, 10)
          : 0,
        gasUsed: response.gasInfo ? parseInt(response.gasInfo.gasUsed, 10) : 0,
      }

      return {
        result: result,
        gasInfo: gasInfo,
      }
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message))
    }
  }

  public async broadcast(
    txRaw: CosmosTxV1Beta1Tx.TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxResponse> {
    const { txService } = this
    const mode =
      options?.mode || CosmosTxV1Beta1Service.BroadcastMode.BROADCAST_MODE_SYNC
    const timeout =
      options?.timeout ||
      new BigNumberInBase(options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT)
        .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
        .toNumber()

    const broadcastTxRequest =
      CosmosTxV1Beta1Service.BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish()
    broadcastTxRequest.mode = mode

    try {
      const response = await txService.BroadcastTx(broadcastTxRequest)

      const txResponse = response.txResponse!

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.rawLog), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      const result = await this.fetchTxPoll(txResponse.txhash, timeout)

      return result
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message))
    }
  }

  /** @deprecated - the BLOCk mode broadcasting is deprecated now, use either sync or async */
  public async broadcastBlock(txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const { txService } = this

    const broadcastTxRequest =
      CosmosTxV1Beta1Service.BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish()
    broadcastTxRequest.mode =
      CosmosTxV1Beta1Service.BroadcastMode.BROADCAST_MODE_BLOCK

    try {
      const response = await txService.BroadcastTx(broadcastTxRequest)

      const txResponse = response.txResponse

      if (!txResponse) {
        throw new GeneralException(
          new Error('There was an issue broadcasting the transaction'),
        )
      }

      const result: TxClientBroadcastResponse = {
        ...txResponse,
        height: parseInt(txResponse.height, 10),
        gasWanted: parseInt(txResponse.gasWanted, 10),
        gasUsed: parseInt(txResponse.gasUsed, 10),
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

      throw new TransactionException(new Error((e as any).message))
    }
  }
}
