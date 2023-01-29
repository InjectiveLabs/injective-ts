import { ServiceClientImpl } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/service'
import {
  BroadcastTxRequest,
  BroadcastMode,
  SimulateRequest,
  GetTxRequest,
} from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/service'
import { TxRaw } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import { grpc } from '@improbable-eng/grpc-web'
import {
  TxClientBroadcastOptions,
  TxClientBroadcastResponse,
  TxConcreteApi,
} from '../types/tx'
import {
  GrpcUnaryRequestException,
  TransactionException,
} from '@injectivelabs/exceptions'
import { getGrpcTransport } from '../../../../utils/grpc'
import { isBrowser } from '../../../../utils/helpers'
import {
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxResponse } from '../types/tx'
import { getRpcInterface } from '../../../../client/BaseGrpcConsumer'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

export class TxGrpcApi implements TxConcreteApi {
  public txService: ServiceClientImpl

  public endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.txService = new ServiceClientImpl(getRpcInterface(endpoint))
  }

  public async fetchTx(hash: string): Promise<TxResponse> {
    const request = GetTxRequest.create()

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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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

  public async simulate(txRaw: TxRaw) {
    const { txService } = this

    const txRawClone = TxRaw.fromPartial({ ...txRaw })
    const simulateRequest = SimulateRequest.create()

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    simulateRequest.txBytes = TxRaw.encode(txRawClone).finish()

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
    txRaw: TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxResponse> {
    const { txService } = this
    const { mode, timeout } = options || {
      mode: BroadcastMode.BROADCAST_MODE_SYNC,
      timeout: DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS || 60000,
    }

    const broadcastTxRequest = BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = TxRaw.encode(txRaw).finish()
    broadcastTxRequest.mode = mode

    try {
      const response = await txService.BroadcastTx(broadcastTxRequest)

      const txResponse = response.txResponse!

      if (txResponse.code === 0) {
        return {
          ...txResponse,
          height: parseInt(txResponse.height, 10),
          gasWanted: parseInt(txResponse.gasWanted, 10),
          gasUsed: parseInt(txResponse.gasUsed, 10),
          txHash: txResponse.txhash,
        }
      }

      const result = await this.fetchTxPoll(txResponse.txhash, timeout)

      return result
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message))
    }
  }

  public async broadcastBlock(
    txRaw: TxRaw,
    broadcastMode: BroadcastMode = BroadcastMode.BROADCAST_MODE_BLOCK,
  ) {
    const { txService } = this

    const broadcastTxRequest = BroadcastTxRequest.create()
    broadcastTxRequest.txBytes = TxRaw.encode(txRaw).finish()
    broadcastTxRequest.mode = broadcastMode

    try {
      const response = await txService.BroadcastTx(broadcastTxRequest)

      const txResponse = response.txResponse

      if (!txResponse) {
        throw new Error('There was an issue broadcasting the transaction')
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
