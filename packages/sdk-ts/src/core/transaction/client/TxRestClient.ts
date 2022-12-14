import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  HttpClient,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import {
  BroadcastMode,
  SimulationResponse,
  TxInfo,
  TxResultResponse,
} from '../types/tx-rest-client'
import { TxClient } from './TxClient'
import { TxClientBroadcastOptions, TxConcreteClient } from '../types/tx'
import {
  HttpRequestException,
  HttpRequestMethod,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { errorToErrorMessage, isTxNotFoundError } from './utils'
import { TxResponse } from './types'

export class TxRestClient implements TxConcreteClient {
  public httpClient: HttpClient

  constructor(endpoint: string) {
    this.httpClient = new HttpClient(endpoint, {
      headers: {
        Accept: 'application/json',
      },
      timeout: 15000,
    })
  }

  public async fetchTx(
    txHash: string,
    params: any = {},
  ): Promise<TxResponse | undefined> {
    try {
      const response = await this.getRaw<TxResultResponse>(
        `/cosmos/tx/v1beta1/txs/${txHash}`,
        params,
      )

      const { tx_response: txResponse } = response

      if (!txResponse) {
        return undefined
      }

      if (parseInt(txResponse.code.toString(), 10) !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: 'TxRestClient',
        })
      }

      return {
        ...txResponse,
        rawLog: txResponse.raw_log,
        gasWanted: parseInt(txResponse.gas_wanted, 10),
        gasUsed: parseInt(txResponse.gas_used, 10),
        height: parseInt(txResponse.height, 10),
        txHash: txResponse.txhash,
      }
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      if (!isTxNotFoundError(e)) {
        throw new TransactionException(
          new Error('There was an issue while fetching transaction details'),
          {
            contextModule: 'tx',
          },
        )
      }

      throw new HttpRequestException(new Error(errorToErrorMessage(e)), {
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
        const txInfo = await this.fetchTx(txHash)
        const txResponse = txInfo

        if (txResponse) {
          return txResponse
        }
      } catch (e: unknown) {
        if (e instanceof TransactionException) {
          throw e
        }

        if (!isTxNotFoundError(e)) {
          throw e
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    throw new TransactionException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      {
        contextModule: 'TxRestClient',
      },
    )
  }

  public async simulate(txRaw: TxRaw) {
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
  }

  public async broadcast(tx: TxRaw, options?: TxClientBroadcastOptions) {
    const { timeout } = options || {
      timeout: DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS || 60000,
    }

    try {
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
    } catch (e) {
      if (e instanceof HttpRequestException) {
        if (e.code === StatusCodes.OK) {
        }
      }

      throw e
    }
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
    const response = await this.postRaw<T>('cosmos/tx/v1beta1/txs', {
      tx_bytes: TxClient.encode(txRaw),
      mode,
    })

    return response
  }

  private async postRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    try {
      return this.httpClient
        .post<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        const message = error.response
          ? typeof error.response.data === 'string'
            ? error.response.data
            : error.response.statusText
          : `The request to ${endpoint} has failed.`

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          method: HttpRequestMethod.Post,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: HttpRequestMethod.Post,
      })
    }
  }

  private async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    try {
      return this.httpClient
        .get<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        const message = error.response
          ? typeof error.response.data === 'string'
            ? error.response.data
            : error.response.statusText
          : `The request to ${endpoint} has failed.`

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          method: HttpRequestMethod.Get,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: HttpRequestMethod.Get,
      })
    }
  }
}
