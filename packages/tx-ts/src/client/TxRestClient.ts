/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { HttpClient } from '@injectivelabs/utils'
import {
  Wait,
  Block,
  Sync,
  TxSuccess,
  TxBroadcastResult,
  TxError,
  TxInfo,
  TxResult,
  BroadcastMode,
  SimulationResponse,
  WaitTxBroadcastResult,
  SyncTxBroadcastResult,
  BlockTxBroadcastResult,
  TxSearchResult,
} from '../types/tx-rest-client'
import { APIParams, TxSearchOptions } from '../types/rest-client'
import { BlockInfo } from '../types/block'
import { TxClient } from './TxClient'
import { hashToHex } from '../utils/crypto'

export function isTxError<
  C extends TxSuccess | TxError | {},
  B extends Wait | Block | Sync,
  T extends TxBroadcastResult<B, C>,
>(x: T): x is T & TxBroadcastResult<B, TxError> {
  return (
    (x as T & TxError).code !== undefined &&
    (x as T & TxError).code !== 0 &&
    (x as T & TxError).code !== '0'
  )
}

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
      throw new Error(e)
    }
  }

  public async txInfo(
    txHash: string,
    params: APIParams = {},
  ): Promise<TxResult> {
    try {
      const response = await this.getRaw<TxResult>(
        `/cosmos/tx/v1beta1/txs/${txHash}`,
        params,
      )

      return response
    } catch (e: any) {
      throw new Error(e)
    }
  }

  public async txInfosByHeight(height: number | undefined): Promise<TxInfo[]> {
    const endpoint =
      height !== undefined
        ? `/cosmos/base/tendermint/v1beta1/blocks/${height}`
        : `/cosmos/base/tendermint/v1beta1/blocks/latest`

    const blockInfo = await this.getRaw<BlockInfo>(endpoint)
    const { txs } = blockInfo.block.data

    if (!txs) {
      return []
    }

    const txHashes = txs.map((txData) => hashToHex(txData))
    const txInfos: TxInfo[] = []

    for (const txhash of txHashes) {
      const txInfo = await this.txInfo(txhash)

      txInfos.push(txInfo.tx_response)
    }

    return txInfos
  }

  public async simulateTx(txRaw: TxRaw): Promise<SimulationResponse> {
    try {
      txRaw.clearSignaturesList()

      const response = await this.postRaw<SimulationResponse>(
        '/cosmos/tx/v1beta1/simulate',
        {
          tx_bytes: TxClient.encode(txRaw),
        },
      )

      return response
    } catch (e: any) {
      throw new Error(e)
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
      throw new Error(e)
    }
  }

  public async waitTxBroadcast(txHash: string, timeout = 30000) {
    const POLL_INTERVAL = 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const txInfo = await this.txInfo(txHash)
        const { tx_response: txInfoSearchResponse } = txInfo

        if (txInfoSearchResponse) {
          return {
            txhash: txInfoSearchResponse.txhash,
            raw_log: txInfoSearchResponse.raw_log,
            gas_wanted: parseInt(txInfoSearchResponse.gas_wanted, 10),
            gas_used: parseInt(txInfoSearchResponse.gas_used, 10),
            height: parseInt(txInfoSearchResponse.height, 10),
            logs: txInfoSearchResponse.logs,
            code: txInfoSearchResponse.code,
            codespace: txInfoSearchResponse.codespace,
            timestamp: txInfoSearchResponse.timestamp,
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

  public async broadcast(
    tx: TxRaw,
    timeout = 30000,
  ): Promise<WaitTxBroadcastResult> {
    const { tx_response: txResponse } = await this.broadcastTx<{
      tx_response: SyncTxBroadcastResult
    }>(tx, BroadcastMode.Sync)

    if ((txResponse as TxError).code !== 0) {
      const result: WaitTxBroadcastResult = {
        height: txResponse.height,
        txhash: txResponse.txhash,
        raw_log: txResponse.raw_log,
        code: (txResponse as TxError).code,
        codespace: (txResponse as TxError).codespace,
        gas_used: 0,
        gas_wanted: 0,
        timestamp: '',
        logs: [],
      }

      return result
    }

    return this.waitTxBroadcast(txResponse.txhash, timeout)
  }

  /**
   * Broadcast the transaction using the "block" mode, waiting for its inclusion in the blockchain.
   * @param tx transaction to broadcast
   */
  public async broadcastBlock(tx: TxRaw): Promise<BlockTxBroadcastResult> {
    const response = await this.broadcastTx<{
      tx_response: BlockTxBroadcastResult
    }>(tx, BroadcastMode.Block)

    const { tx_response: txResponse } = response

    return {
      txhash: txResponse.txhash,
      raw_log: txResponse.raw_log,
      gas_wanted: txResponse.gas_wanted,
      gas_used: txResponse.gas_used,
      height: txResponse.height,
      logs: txResponse.logs,
      code: (txResponse as TxError).code,
      codespace: (txResponse as TxError).codespace,
      data: txResponse.data,
      info: txResponse.info,
      timestamp: txResponse.timestamp,
    }
  }

  /**
   * NOTE: This is not a synchronous function and is unconventionally named. This function
   * can be await as it returns a `Promise`.
   *
   * Broadcast the transaction using the "sync" mode, returning after CheckTx() is performed.
   * @param tx transaction to broadcast
   */
  public async broadcastSync(tx: TxRaw): Promise<SyncTxBroadcastResult> {
    const response = await this.broadcastTx<{
      tx_response: BlockTxBroadcastResult
    }>(tx, BroadcastMode.Sync)

    const { tx_response: txResponse } = response

    const blockResult: any = {
      height: txResponse.height,
      txhash: txResponse.txhash,
      raw_log: txResponse.raw_log,
    }

    if ((txResponse as TxError).code) {
      blockResult.code = (txResponse as TxError).code
    }

    if ((txResponse as TxError).codespace) {
      blockResult.codespace = (txResponse as TxError).codespace
    }

    return blockResult
  }

  /**
   * Search for transactions based on event attributes.
   * @param options
   */
  public async search(
    options: Partial<TxSearchOptions>,
  ): Promise<TxSearchResult> {
    const params = new URLSearchParams()

    // build search params
    options.events?.forEach((v) =>
      params.append(
        'events',
        v.key === 'tx.height' ? `${v.key}=${v.value}` : `${v.key}='${v.value}'`,
      ),
    )

    delete options.events

    Object.entries(options).forEach((v) => {
      params.append(v[0], v[1] as string)
    })

    const response = await this.getRaw<TxSearchResult>(
      `cosmos/tx/v1beta1/txs`,
      params,
    )

    return response
  }

  private async postRaw<T>(
    endpoint: string,
    params: URLSearchParams | APIParams = {},
  ): Promise<T> {
    return this.httpClient
      .post<URLSearchParams | APIParams, { data: T }>(endpoint, params)
      .then((d) => d.data)
  }

  private async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | APIParams = {},
  ): Promise<T> {
    return this.httpClient
      .get<URLSearchParams | APIParams, { data: T }>(endpoint, params)
      .then((d) => d.data)
  }
}
