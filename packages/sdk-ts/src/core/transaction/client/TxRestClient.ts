import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { HttpClient } from '@injectivelabs/utils'
import {
  BroadcastMode,
  SimulationResponse,
  TxInfo,
  TxResultResponse,
} from '../types/tx-rest-client'
import { TxClient } from './TxClient'
import { TxClientBroadcastOptions, TxConcreteClient } from '../types/tx'

export class TxRestClient implements TxConcreteClient {
  public httpClient: HttpClient

  constructor(endpoint: string) {
    this.httpClient = new HttpClient(endpoint, {
      headers: {
        Accept: 'application/json',
      },
      timeout: 3000,
    })
  }

  public async fetchTx(txHash: string, params: any = {}) {
    try {
      const response = await this.getRaw<TxResultResponse>(
        `/cosmos/tx/v1beta1/txs/${txHash}`,
        params,
      )

      const { tx_response: txResponse } = response

      if (!txResponse) {
        return undefined
      }

      return {
        ...txResponse,
        rawLog: txResponse.raw_log,
        gasWanted: parseInt(txResponse.gas_wanted, 10),
        gasUsed: parseInt(txResponse.gas_used, 10),
        height: parseInt(txResponse.height, 10),
        txHash: txResponse.txhash,
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async fetchTxPoll(txHash: string, timeout = 30000) {
    const POLL_INTERVAL = 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const txInfo = await this.fetchTx(txHash)
        const txResponse = txInfo

        if (txResponse) {
          return txResponse
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

  public async simulate(txRaw: TxRaw) {
    try {
      const response = await this.postRaw<SimulationResponse>(
        '/cosmos/tx/v1beta1/simulate',
        {
          tx_bytes: TxClient.encode(txRaw),
        },
      )

      return {
        result: {
          data: response.result.data,
          log: response.result.log,
          eventsList: response.result.events,
        },
        gasInfo: {
          gasWanted: parseInt(response.gas_info.gas_wanted, 10),
          gasUsed: parseInt(response.gas_info.gas_used, 10),
        },
      }
    } catch (e: any) {
      throw new Error(e.response ? e.response.data.message : e)
    }
  }

  public async broadcast(tx: TxRaw, options?: TxClientBroadcastOptions) {
    const { timeout } = options || { timeout: 30000 }
    const { tx_response: txResponse } = await this.broadcastTx<{
      tx_response: TxInfo
    }>(tx, BroadcastMode.Sync)

    if (txResponse.code !== 0) {
      return {
        height: parseInt(txResponse.height || '0', 10),
        txHash: txResponse.txhash,
        rawLog: txResponse.rawLog,
        code: txResponse.code,
        codespace: txResponse.codespace,
        gasUsed: 0,
        gasWanted: 0,
        timestamp: '',
        logs: [],
        data: '',
        info: '',
        tx: undefined,
      }
    }

    return this.fetchTxPoll(txResponse.txhash, timeout)
  }

  /**
   * Broadcast the transaction using the "block" mode, waiting for its inclusion in the blockchain.
   * @param tx transaction to broadcast
   */
  public async broadcastBlock(tx: TxRaw) {
    const response = await this.broadcastTx<{
      tx_response: TxInfo
    }>(tx, BroadcastMode.Block)

    const { tx_response: txResponse } = response

    return {
      txHash: txResponse.txhash,
      rawLog: txResponse.rawLog,
      gasWanted: parseInt(txResponse.gasWanted || '0', 10),
      gasUsed: parseInt(txResponse.gasUsed || '0', 10),
      height: parseInt(txResponse.height || '0', 10),
      logs: txResponse.logs || [],
      code: txResponse.code,
      codespace: txResponse.codespace,
      data: txResponse.data,
      info: txResponse.info,
      timestamp: txResponse.timestamp || '0',
    }
  }

  private async broadcastTx<T>(
    txRaw: TxRaw,
    mode: BroadcastMode = BroadcastMode.Sync,
  ): Promise<T> {
    try {
      const response = await this.postRaw<T>('cosmos/tx/v1beta1/txs', {
        tx_bytes: TxClient.encode(txRaw),
        mode,
      })

      return response
    } catch (e: any) {
      throw new Error(e.response ? e.response.data.message : e)
    }
  }

  private async postRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    return this.httpClient
      .post<URLSearchParams | any, { data: T }>(endpoint, params)
      .then((d) => d.data)
  }

  private async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    return this.httpClient
      .get<URLSearchParams | any, { data: T }>(endpoint, params)
      .then((d) => d.data)
  }
}
