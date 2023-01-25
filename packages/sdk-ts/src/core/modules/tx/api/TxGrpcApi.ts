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

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

export class TxGrpcApi implements TxConcreteApi {
  public txService: ServiceClient

  public endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.txService = new ServiceClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  public async fetchTx(hash: string): Promise<TxResponse> {
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
        throw new GrpcUnaryRequestException(
          new Error(`The transaction with ${hash} is not found`),
          {
            context: 'TxGrpcApi',
            contextModule: 'fetch-tx',
          },
        )
      }

      if (txResponse.getCode() !== 0) {
        throw new TransactionException(new Error(txResponse.getRawLog()), {
          contextCode: txResponse.getCode(),
          contextModule: txResponse.getCodespace(),
        })
      }

      return {
        ...txResponse.toObject(),
        txHash: txResponse.getTxhash(),
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

    const txRawClone = txRaw.clone()
    const simulateRequest = new SimulateRequest()

    if (txRawClone.getSignaturesList().length === 0) {
      txRawClone.setSignaturesList([new Uint8Array(0)])
    }

    simulateRequest.setTxBytes(txRawClone.serializeBinary())

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

  public async broadcast(
    txRaw: TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxResponse> {
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

            if (txResponse.getCode() === 0) {
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
                new Error('There was an issue broadcasting the transaction'),
              )
            }

            const result: TxClientBroadcastResponse = {
              ...txResponse.toObject(),
              txHash: txResponse.getTxhash(),
            }

            if (result.code !== 0) {
              return reject(
                new TransactionException(new Error(result.rawLog), {
                  contextCode: result.code,
                  contextModule: result.codespace,
                }),
              )
            }

            return resolve(result as TxClientBroadcastResponse)
          }),
      )
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

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
