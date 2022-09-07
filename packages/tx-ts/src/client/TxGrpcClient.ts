import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
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
  TxResponse,
} from '@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { isServerSide } from '@injectivelabs/utils'
import { grpc } from '@improbable-eng/grpc-web'

if (isServerSide()) {
  grpc.setDefaultTransport(NodeHttpTransport())
}

export class TxGrpcClient {
  public txService: ServiceClient

  public endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.txService = new ServiceClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
    })
  }

  public async getTx(hash: string) {
    const request = new GetTxRequest()

    request.setHash(hash)

    try {
      const response = await this.request<
        GetTxRequest,
        GetTxResponse,
        typeof Service.GetTx
      >(request, Service.GetTx)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public async waitTxBroadcast(txHash: string, timeout = 30000) {
    const POLL_INTERVAL = 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const txInfo = await this.getTx(txHash)
        const txResponse = txInfo.getTxResponse()!

        if (txInfo.hasTxResponse()) {
          return {
            txhash: txResponse.getTxhash(),
            raw_log: txResponse.getRawLog(),
            gas_wanted: txResponse.getGasWanted(),
            gas_used: txResponse.getGasUsed(),
            height: txResponse.getHeight(),
            logs: txResponse.getLogsList(),
            code: txResponse.getCode(),
            codespace: txResponse.getCodespace(),
            timestamp: txResponse.getTimestamp(),
          }
        }
      } catch (error: any) {
        if (!error.toString().includes('404')) {
          throw error
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    throw new Error(
      `Transaction was not included in a block before timeout of ${timeout}ms`,
    )
  }

  public async simulate(txRaw: TxRaw): Promise<{
    result: Result.AsObject
    gasInfo: GasInfo.AsObject
  }> {
    const { txService } = this

    const simulateRequest = new SimulateRequest()
    simulateRequest.setTxBytes(txRaw.serializeBinary())

    try {
      return new Promise((resolve, reject) =>
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
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public async broadcast(
    txRaw: TxRaw,
    timeout = 30000,
    broadcastMode: BroadcastModeMap[keyof BroadcastModeMap] = BroadcastMode.BROADCAST_MODE_SYNC,
  ): Promise<TxResponse.AsObject> {
    const { txService } = this

    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setTxBytes(txRaw.serializeBinary())
    broadcastTxRequest.setMode(broadcastMode)

    try {
      return new Promise((resolve, reject) =>
        txService.broadcastTx(broadcastTxRequest, (error, response) => {
          if (error || !response) {
            return reject(error)
          }

          const txResponse = response.getTxResponse()!

          if (txResponse.getCode() !== 0) {
            return resolve(txResponse.toObject())
          }

          return this.waitTxBroadcast(txResponse.getTxhash(), timeout)
        }),
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public async broadcastBlock(
    txRaw: TxRaw,
    broadcastMode: BroadcastModeMap[keyof BroadcastModeMap] = BroadcastMode.BROADCAST_MODE_BLOCK,
  ): Promise<TxResponse.AsObject> {
    const { txService } = this

    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setTxBytes(txRaw.serializeBinary())
    broadcastTxRequest.setMode(broadcastMode)

    try {
      return new Promise((resolve, reject) =>
        txService.broadcastTx(broadcastTxRequest, (error, response) => {
          if (error || !response) {
            return reject(error)
          }

          const txResponse = response.getTxResponse()

          return resolve(
            (txResponse ? txResponse.toObject() : {}) as TxResponse.AsObject,
          )
        }),
      )
    } catch (e: any) {
      throw new Error(e.message)
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
