import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { StargateClient, DeliverTxResponse } from '@cosmjs/stargate'
import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'
import { createTxRawFromSigResponse } from '@injectivelabs/tx-ts'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'

export class CosmosClient {
  // @ts-ignore
  private rest: string

  private rpc: string

  constructor({ rpc, rest }: { rpc: string; rest: string }) {
    this.rpc = rpc
    this.rest = rest
  }

  async broadcastTransactionFromDirectSignResponse(
    signResponse: DirectSignResponse,
  ): Promise<DeliverTxResponse> {
    const client = await this.getStargateClient()
    const txRaw = createTxRawFromSigResponse(signResponse)

    return client.broadcastTx(
      txRaw.serializeBinary(),
      DEFAULT_TIMESTAMP_TIMEOUT_MS,
    )
  }

  async broadcastTransaction(txRaw: TxRaw): Promise<DeliverTxResponse> {
    const client = await this.getStargateClient()

    return client.broadcastTx(
      txRaw.serializeBinary(),
      DEFAULT_TIMESTAMP_TIMEOUT_MS,
    )
  }

  async simulateTransaction(txRaw: TxRaw): Promise<DeliverTxResponse> {
    const client = await this.getStargateClient()

    return client.broadcastTx(
      txRaw.serializeBinary(),
      DEFAULT_TIMESTAMP_TIMEOUT_MS,
    )
  }

  private async getStargateClient() {
    const { rpc } = this

    return StargateClient.connect(rpc)
  }
}
