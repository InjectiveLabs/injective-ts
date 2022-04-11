import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import { Block } from '@injectivelabs/explorer-consumer'
import { ExplorerMetrics } from '../../types/metrics'
import { BaseService } from '../BaseService'
import { NetworkTransformer } from './transformer'
import {
  ExplorerApiResponse,
  BlockFromExplorerApiResponse,
  BlockWithTxs,
  ExplorerBlockApiResponse,
  TransactionFromExplorerApiResponse,
  Transaction,
  ExplorerTransactionApiResponse,
} from './types'
import {
  BlockNotFoundException,
  TransactionNotFoundException,
} from './exceptions'
import { DEFAULT_PAGINATION_TOTAL_COUNT } from '../../constants'
import { ServiceOptions } from '../../types/index'

export class NetworkService extends BaseService {
  protected consumer: HttpClient

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new HttpClient(
      `${this.endpoints.exchangeApi}/api/explorer/v1`,
    )
  }

  async fetchBlock(blockHashHeight: string): Promise<BlockWithTxs> {
    try {
      const response = (await this.consumer.get(
        `blocks/${blockHashHeight}`,
      )) as ExplorerApiResponse<BlockFromExplorerApiResponse>

      return NetworkTransformer.blockWithTxToBlockWithTx(response.data.data)
    } catch (error: any) {
      if (error.response.status === 404) {
        throw new BlockNotFoundException(error.message)
      } else {
        throw new HttpException(error.message)
      }
    }
  }

  async fetchBlocks({ limit = 50 }: { limit: number }): Promise<Block[]> {
    try {
      const promise = this.consumer.get('blocks', {
        limit,
      })

      const response = (await this.fetchOrFetchAndMeasure(
        promise,
        ExplorerMetrics.FetchBlocks,
      )) as ExplorerApiResponse<BlockFromExplorerApiResponse[]>

      return NetworkTransformer.blocksToBlocks(response.data.data)
    } catch (error) {
      throw new HttpException((error as any).message)
    }
  }

  async fetchBlocksWithTx({
    before,
    limit = 50,
  }: {
    before: number | undefined
    limit: number
  }): Promise<{ total: number; blocks: BlockWithTxs[] }> {
    try {
      const promise = this.consumer.get('blocks', {
        limit,
        before,
      })

      const response = (await this.fetchOrFetchAndMeasure(
        promise,
        ExplorerMetrics.FetchBlocks,
      )) as ExplorerApiResponse<ExplorerBlockApiResponse>

      const { paging, data } = response.data

      return {
        total: paging.total > 0 ? paging.total : DEFAULT_PAGINATION_TOTAL_COUNT,
        blocks: data.data
          ? NetworkTransformer.blocksWithTxsToBlocksWithTxs(data.data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchTransactions({
    before,
    limit = 50,
    skip,
  }: {
    before: number | undefined
    limit: number
    skip: number | undefined
  }): Promise<{ total: number; transactions: Transaction[] }> {
    try {
      const promise = this.consumer.get('txs', {
        before,
        limit,
        skip,
      })

      const response = (await this.fetchOrFetchAndMeasure(
        promise,
        ExplorerMetrics.FetchTransactions,
      )) as ExplorerApiResponse<ExplorerTransactionApiResponse>

      const { paging, data } = response.data

      return {
        total: paging.total > 0 ? paging.total : DEFAULT_PAGINATION_TOTAL_COUNT,
        transactions: data
          ? NetworkTransformer.transactionsToTransactions(data.data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchAccountTransactions({
    account,
    before,
    limit,
    skip,
  }: {
    account: string
    before: number | undefined
    limit: number
    skip: number | undefined
  }): Promise<{ total: number; transactions: Transaction[] }> {
    try {
      const promise = this.consumer.get(`accountTxs/${account}`, {
        before,
        limit,
        skip,
      })

      const response = (await this.fetchOrFetchAndMeasure(
        promise,
        ExplorerMetrics.FetchTransactions,
      )) as ExplorerApiResponse<ExplorerTransactionApiResponse>

      const { paging, data } = response.data

      return {
        total: paging.total > 0 ? paging.total : DEFAULT_PAGINATION_TOTAL_COUNT,
        transactions: data
          ? NetworkTransformer.transactionsToTransactions(data.data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchTransaction({ hash }: { hash: string }): Promise<Transaction> {
    try {
      const promise = this.consumer.get(`txs/${hash}`)

      const response = (await this.fetchOrFetchAndMeasure(
        promise,
        ExplorerMetrics.FetchTransactions,
      )) as ExplorerApiResponse<TransactionFromExplorerApiResponse>

      return NetworkTransformer.transactionToTransaction(response.data.data)
    } catch (error: any) {
      if (error.response.status === 404) {
        throw new TransactionNotFoundException(error.message)
      } else {
        throw new HttpException(error.message)
      }
    }
  }
}
