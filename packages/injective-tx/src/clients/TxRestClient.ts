import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { HttpClient } from '@injectivelabs/utils'

export class TxRestClient {
  public httpClient: HttpClient

  constructor(endpoint: string) {
    this.httpClient = new HttpClient(endpoint)
  }

  public async simulate(txRaw: TxRaw): Promise<any> {
    try {
      return await this.httpClient.post('cosmos/tx/v1beta1/simulate', {
        tx_bytes: Buffer.from(txRaw.serializeBinary()).toString('base64'),
      })
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  public async broadcast(txRaw: TxRaw): Promise<any /** TODO */> {
    try {
      return await this.httpClient.post('cosmos/tx/v1beta1/txs', {
        tx_bytes: Buffer.from(txRaw.serializeBinary()).toString('base64'),
        mode: 'BROADCAST_MODE_BLOCK',
      })
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
