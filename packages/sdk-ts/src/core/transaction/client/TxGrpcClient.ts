import {
  ServiceClient,
  Service,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb_service'
import {
  BroadcastTxRequest,
  BroadcastMode,
  SimulateRequest,
  BroadcastModeMap,
  GetTxRequest,
  GetTxResponse,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb'
import {
  GasInfo,
  Result,
} from '@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { grpc } from '@improbable-eng/grpc-web'
import {
  TxClientBroadcastOptions,
  TxClientBroadcastResponse,
  TxClientSimulateResponse,
  TxConcreteClient,
} from '../types/tx'
import {
  GrpcUnaryRequestException,
  TransactionException,
} from '@injectivelabs/exceptions'
import { getGrpcTransport } from '../../../utils/grpc'
import { isBrowser } from '../../../utils/helpers'
import { errorToErrorMessage, isTxNotFoundError } from './utils'
import {
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxResponse } from './types'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * It is recommended to use TxRestClient instead of TxGrpcClient
 */
export class TxGrpcClient implements TxConcreteClient {
  public txService: ServiceClient

  public endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.txService = new ServiceClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  public async fetchTx(hash: string): Promise<TxResponse | undefined> {
    const request = new GetTxRequest()

    request.setHash(hash)

    try {
      const response = await this.request<
        GetTxRequest,
        GetTxResponse,
        typeof Service.GetTx
      >(request, Service.GetTx)

      const txResponse = response.getTxResponse()

      if (!txResponse) {
        return undefined
      }

      if (txResponse.getCode() !== 0) {
        throw new TransactionException(new Error(txResponse.getRawLog()), {
          contextCode: txResponse.getCode(),
          contextModule: 'TxGrpcClient',
        })
      }

      return {
        ...txResponse.toObject(),
        txHash: txResponse.getTxhash(),
      }
    } catch (e: unknown) {
      if (!isTxNotFoundError(e)) {
        throw new TransactionException(
          new Error('There was an issue while fetching transaction details'),
          {
            contextModule: 'tx',
          },
        )
      }

      throw new GrpcUnaryRequestException(new Error(errorToErrorMessage(e)), {
        contextModule: 'tx',
      })
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
      } catch (error: any) {
        if (!isTxNotFoundError(error)) {
          throw error
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    throw new TransactionException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      {
        contextModule: 'TxGrpcClient',
      },
    )
  }

  public async simulate(txRaw: TxRaw) {
    const { txService } = this

    const simulateRequest = new SimulateRequest()
    simulateRequest.setTxBytes(txRaw.serializeBinary())

    try {
      return new Promise(
        (resolve: (value: TxClientSimulateResponse) => void, reject) =>
          txService.simulate(simulateRequest, (error, response) => {
            if (error || !response) {
              return reject(error)
            }

            const result = response.getResult()
            const gasInfo = response.getGasInfo()

            return resolve({
              result: result ? result.toObject() : ({} as Result.AsObject),
              gasInfo: gasInfo ? gasInfo.toObject() : ({} as GasInfo.AsObject),
            })
          }),
      )
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message))
    }
  }

  public async broadcast(txRaw: TxRaw, options?: TxClientBroadcastOptions) {
    const { txService } = this
    const { mode, timeout } = options || {
      mode: BroadcastMode.BROADCAST_MODE_SYNC,
      timeout: DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS || 60000,
    }

    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setTxBytes(txRaw.serializeBinary())
    broadcastTxRequest.setMode(mode)

    try {
      return new Promise(
        (resolve: (value: TxClientBroadcastResponse) => void, reject) =>
          txService.broadcastTx(broadcastTxRequest, async (error, response) => {
            if (error || !response) {
              return reject(error)
            }

            const txResponse = response.getTxResponse()!

            if (txResponse.getCode() !== 0) {
              return resolve({
                ...txResponse.toObject(),
                txHash: txResponse.getTxhash(),
              })
            }

            const result = await this.fetchTxPoll(
              txResponse.getTxhash(),
              timeout,
            )

            return resolve(result)
          }),
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message))
    }
  }

  public async broadcastBlock(
    txRaw: TxRaw,
    broadcastMode: BroadcastModeMap[keyof BroadcastModeMap] = BroadcastMode.BROADCAST_MODE_BLOCK,
  ) {
    const { txService } = this

    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setTxBytes(txRaw.serializeBinary())
    broadcastTxRequest.setMode(broadcastMode)

    try {
      return new Promise(
        (resolve: (value: TxClientBroadcastResponse) => void, reject) =>
          txService.broadcastTx(broadcastTxRequest, (error, response) => {
            if (error || !response) {
              return reject(error)
            }

            const txResponse = response.getTxResponse()

            if (!txResponse) {
              return reject(
                new Error(
                  'There was an problem while broadcasting the transaction',
                ),
              )
            }

            const result: TxClientBroadcastResponse = {
              ...txResponse.toObject(),
              txHash: txResponse.getTxhash(),
            }

            return resolve(result as TxClientBroadcastResponse)
          }),
      )
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message))
    }
  }

  private request<
    TRequest extends grpc.ProtobufMessage,
    TResponse extends grpc.ProtobufMessage,
    S extends grpc.UnaryMethodDefinition<TRequest, TResponse>,
  >(request: TRequest, service: S): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      grpc.unary(service, {
        request,
        host: this.endpoint,
        onEnd: (res) => {
          const { statusMessage, status, message } = res

          if (status === grpc.Code.OK && message) {
            resolve(message as TResponse)
          }

          reject(new Error(statusMessage))
        },
      })
    })
  }
}
