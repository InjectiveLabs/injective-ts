import {
  HttpClient,
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
  DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS,
} from '@injectivelabs/utils'
import {
  BroadcastMode,
  TxInfoResponse,
  TxResultResponse,
  SimulationResponse,
} from '../types/tx-rest-client'
import { TxClient } from '../utils/classes/TxClient'
import { TxClientBroadcastOptions, TxConcreteApi } from '../types/tx'
import {
  HttpRequestMethod,
  HttpRequestException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import axios, { AxiosError } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { TxResponse } from '../types/tx'
import { getErrorMessage } from '../../../../utils/helpers'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/core-proto-ts'

/**
 * It is recommended to use TxGrpcClient instead of TxRestApi
 */
export class TxRestApi implements TxConcreteApi {
  public httpClient: HttpClient

  constructor(endpoint: string, options?: { timeout?: number }) {
    this.httpClient = new HttpClient(endpoint, {
      headers: {
        Accept: 'application/json',
      },
      timeout: options?.timeout || 15000,
    })
  }

  public async fetchTx(txHash: string, params: any = {}): Promise<TxResponse> {
    try {
      const response = await this.getRaw<TxResultResponse>(
        `/cosmos/tx/v1beta1/txs/${txHash}`,
        params,
      )

      const { tx_response: txResponse } = response

      if (!txResponse) {
        throw new HttpRequestException(
          new Error(`The transaction with ${txHash} is not found`),
          {
            context: 'TxRestApi',
            contextModule: 'fetch-tx',
          },
        )
      }

      if (parseInt(txResponse.code.toString(), 10) !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
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
      // Transaction has failed on the chain
      if (e instanceof TransactionException) {
        throw e
      }

      // Failed to query the transaction on the chain
      if (e instanceof HttpRequestException) {
        throw e
      }

      // The response itself failed
      throw new HttpRequestException(
        new Error('There was an issue while fetching transaction details'),
        {
          context: 'TxRestApi',
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
        const txInfo = await this.fetchTx(txHash)
        const txResponse = txInfo

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

    throw new HttpRequestException(
      new Error(
        `Transaction was not included in a block before timeout of ${timeout}ms`,
      ),
      {
        context: 'TxRestApi',
        contextModule: 'fetch-tx-poll',
      },
    )
  }

  public async simulate(txRaw: CosmosTxV1Beta1Tx.TxRaw) {
    const txRawClone = CosmosTxV1Beta1Tx.TxRaw.fromPartial({ ...txRaw })

    if (txRawClone.signatures.length === 0) {
      txRawClone.signatures = [new Uint8Array(0)]
    }

    try {
      const response = await this.postRaw<SimulationResponse>(
        '/cosmos/tx/v1beta1/simulate',
        {
          tx_bytes: TxClient.encode(txRawClone),
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
    } catch (e) {
      throw new TransactionException(new Error((e as any).message))
    }
  }

  public async broadcast(
    tx: CosmosTxV1Beta1Tx.TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxResponse> {
    const timeout =
      options?.timeout ||
      new BigNumberInBase(options?.txTimeout || DEFAULT_BLOCK_TIMEOUT_HEIGHT)
        .times(DEFAULT_BLOCK_TIME_IN_SECONDS * 1000)
        .toNumber()

    try {
      const { tx_response: txResponse } = await this.broadcastTx<{
        tx_response: TxInfoResponse
      }>(tx, BroadcastMode.Sync)

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return this.fetchTxPoll(txResponse.txhash, timeout)
    } catch (e) {
      if (e instanceof HttpRequestException) {
        if (e.code !== StatusCodes.OK) {
          throw e
        }
      }

      throw e
    }
  }

  /**
   * Broadcast the transaction using the "block" mode, waiting for its inclusion in the blockchain.
   * @param tx transaction to broadcast
   *
   * @deprecated - the BLOCk mode broadcasting is deprecated now, use either sync or async
   */
  public async broadcastBlock(tx: CosmosTxV1Beta1Tx.TxRaw) {
    const response = await this.broadcastTx<{
      tx_response: TxInfoResponse
    }>(tx, BroadcastMode.Block)

    try {
      const { tx_response: txResponse } = response

      if (txResponse.code !== 0) {
        throw new TransactionException(new Error(txResponse.raw_log), {
          contextCode: txResponse.code,
          contextModule: txResponse.codespace,
        })
      }

      return {
        txHash: txResponse.txhash,
        rawLog: txResponse.raw_log,
        gasWanted: parseInt(txResponse.gas_wanted || '0', 10),
        gasUsed: parseInt(txResponse.gas_used || '0', 10),
        height: parseInt(txResponse.height || '0', 10),
        logs: txResponse.logs || [],
        code: txResponse.code,
        codespace: txResponse.codespace,
        data: txResponse.data,
        info: txResponse.info,
        timestamp: txResponse.timestamp || '0',
      }
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message))
    }
  }

  private async broadcastTx<T>(
    txRaw: CosmosTxV1Beta1Tx.TxRaw,
    mode: BroadcastMode = BroadcastMode.Sync,
  ): Promise<T> {
    const response = await this.postRaw<T>('cosmos/tx/v1beta1/txs', {
      tx_bytes: TxClient.encode(txRaw),
      mode,
    })

    return response
  }

  private async getRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    try {
      return await this.httpClient
        .get<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new HttpRequestException(new Error(error.message), {
            code: StatusCodes.REQUEST_TOO_LONG,
            context: endpoint,
            method: HttpRequestMethod.Get,
          })
        }

        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          context: endpoint,
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          method: HttpRequestMethod.Get,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        context: endpoint,
        code: UnspecifiedErrorCode,
        contextModule: HttpRequestMethod.Get,
      })
    }
  }

  private async postRaw<T>(
    endpoint: string,
    params: URLSearchParams | any = {},
  ): Promise<T> {
    try {
      return await this.httpClient
        .post<URLSearchParams | any, { data: T }>(endpoint, params)
        .then((d) => d.data)
    } catch (e) {
      const error = e as Error | AxiosError

      if (axios.isAxiosError(error)) {
        const message = getErrorMessage(error, endpoint)

        throw new HttpRequestException(new Error(message), {
          code: error.response
            ? error.response.status
            : StatusCodes.BAD_REQUEST,
          context: endpoint,
          contextModule: HttpRequestMethod.Post,
        })
      }

      throw new HttpRequestException(new Error((error as any).message), {
        code: UnspecifiedErrorCode,
        context: endpoint,
        contextModule: HttpRequestMethod.Post,
      })
    }
  }
}
