import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ServiceClient } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb_service'
import {
  BroadcastTxRequest,
  BroadcastMode,
  SimulateRequest,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb'
import {
  GasInfo,
  Result,
  TxResponse,
} from '@injectivelabs/chain-api/cosmos/base/abci/v1beta1/abci_pb'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'

export class TxGrpcClient {
  public txService: ServiceClient

  constructor(endpoint: string) {
    this.txService = new ServiceClient(endpoint, {
      transport: NodeHttpTransport(),
    })
  }

  public async simulate(txRaw: TxRaw): Promise<{
    result: Result.AsObject
    gasInfo: GasInfo.AsObject
  }> {
    const simulateRequest = new SimulateRequest()
    simulateRequest.setTxBytes(txRaw.serializeBinary())

    try {
      return new Promise((resolve, reject) =>
        this.txService.simulate(simulateRequest, (error, response) => {
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

  public async broadcast(txRaw: TxRaw): Promise<TxResponse.AsObject> {
    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setTxBytes(txRaw.serializeBinary())
    broadcastTxRequest.setMode(BroadcastMode.BROADCAST_MODE_BLOCK)

    try {
      return new Promise((resolve, reject) =>
        this.txService.broadcastTx(broadcastTxRequest, (error, response) => {
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
}
