import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import { IndexerRestExplorerTransformer } from '../transformers/index.js'
import type { AxiosRequestConfig } from 'axios'
import type { RequestOptions } from '@injectivelabs/utils'
import type { MsgType, MsgStatus } from '@injectivelabs/ts-types'
import type { Block, ExplorerValidator } from '../types/explorer.js'
import type {
  Paging,
  Contract,
  WasmCode,
  BankTransfer,
  ExplorerTransaction,
  ContractTransaction,
  ExplorerBlockWithTxs,
  ExplorerValidatorUptime,
  ExplorerCW20BalanceWithToken,
  ContractTransactionWithMessages,
} from '../types/explorer.js'
import type {
  ExplorerApiResponse,
  ContractExplorerApiResponse,
  WasmCodeExplorerApiResponse,
  BlockFromExplorerApiResponse,
  CW20BalanceExplorerApiResponse,
  ExplorerApiResponseWithPagination,
  TransactionFromExplorerApiResponse,
  BankTransferFromExplorerApiResponse,
  ValidatorUptimeFromExplorerApiResponse,
  ContractTransactionExplorerApiResponse,
} from '../types/explorer-rest.js'

const explorerEndpointSuffix = 'api/explorer/v1'

/**
 * @category Indexer Rest API
 */
export class IndexerRestExplorerApi extends BaseRestConsumer {
  constructor(endpoint: string, options?: AxiosRequestConfig) {
    super(
      endpoint.includes(explorerEndpointSuffix)
        ? endpoint
        : `${endpoint}/${explorerEndpointSuffix}`,
      options,
    )
  }

  async fetchBlock(
    blockHashHeight: string,
    options?: RequestOptions,
  ): Promise<ExplorerBlockWithTxs> {
    throwIfAborted(options?.signal)
    const endpoint = `blocks/${blockHashHeight}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse>
      >(
        (requestConfig) =>
          this.get(`blocks/${blockHashHeight}`, {}, requestConfig),
        options,
      )

      return IndexerRestExplorerTransformer.blockWithTxToBlockWithTx(
        response.data.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchBlocks(
    params?: {
      before?: number
      limit?: number
      from?: number
      to?: number
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; blocks: Block[] }> {
    throwIfAborted(options?.signal)
    const endpoint = 'blocks'

    try {
      const { before, limit, from, to } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              before,
              limit,
              from,
              to,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        blocks: IndexerRestExplorerTransformer.blocksToBlocks(data),
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchBlocksWithTx(
    params?: {
      before?: number
      limit?: number
      from?: number
      to?: number
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; blocks: ExplorerBlockWithTxs[] }> {
    throwIfAborted(options?.signal)
    const endpoint = 'blocks'

    try {
      const { before, limit, from, to } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              before,
              limit,
              from,
              to,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        blocks: data
          ? IndexerRestExplorerTransformer.blocksWithTxsToBlocksWithTxs(data)
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchTransactions(
    params?: {
      fromNumber?: number
      limit?: number
      before?: number
      after?: number
      toNumber?: number
      skip?: number
      startTime?: number
      endTime?: number
      status?: MsgStatus
      type?: MsgType[]
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    throwIfAborted(options?.signal)
    const endpoint = 'txs'

    try {
      const {
        type,
        skip,
        after,
        limit,
        before,
        status,
        endTime,
        toNumber,
        startTime,
        fromNumber,
      } = params || {
        limit: 12,
      }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              after,
              before,
              status,
              end_time: endTime,
              to_number: toNumber,
              start_time: startTime,
              from_number: fromNumber,
              type: type ? type.join(',') : undefined,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? IndexerRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchAccountTransactions(
    {
      account,
      params,
    }: {
      account: string
      params?: {
        skip?: number
        limit?: number
        after?: number
        before?: number
        type?: MsgType[]
        status?: MsgStatus
        endTime?: number
        toNumber?: number
        fromNumber?: number
        startTime?: number
        withClaimId?: boolean
      }
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    throwIfAborted(options?.signal)
    const endpoint = `accountTxs/${account}`

    try {
      const {
        type,
        skip,
        limit,
        after,
        before,
        status,
        endTime,
        toNumber,
        startTime,
        fromNumber,
        withClaimId,
      } = params || {
        limit: 12,
      }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              after,
              before,
              status,
              end_time: endTime,
              to_number: toNumber,
              start_time: startTime,
              from_number: fromNumber,
              type: type ? type.join(',') : undefined,
              with_claim_id: withClaimId,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? IndexerRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchTransaction(
    hash: string,
    isEvmTx = false,
    options?: RequestOptions,
  ): Promise<ExplorerTransaction> {
    throwIfAborted(options?.signal)
    const endpoint = `txs/${hash}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse>
      >(
        (requestConfig) =>
          this.get(endpoint, { is_evm_hash: isEvmTx }, requestConfig),
        options,
      )

      return IndexerRestExplorerTransformer.transactionToTransaction(
        response.data.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchValidators(
    options?: RequestOptions,
  ): Promise<Partial<ExplorerValidator>[]> {
    throwIfAborted(options?.signal)
    const endpoint = 'validators'

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<any[]>
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      if (!response.data || !response.data.data) {
        return []
      }

      return IndexerRestExplorerTransformer.validatorExplorerToValidator(
        response.data.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchValidatorUptime(
    validatorConsensusAddress: string,
    options?: RequestOptions,
  ): Promise<ExplorerValidatorUptime[]> {
    throwIfAborted(options?.signal)
    const endpoint = `validator_uptime/${validatorConsensusAddress}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ValidatorUptimeFromExplorerApiResponse[]
        >
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      if (!response.data || !response.data.data) {
        return []
      }

      return IndexerRestExplorerTransformer.validatorUptimeToExplorerValidatorUptime(
        response.data.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContract(
    contractAddress: string,
    options?: RequestOptions,
  ): Promise<Contract> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/contracts/${contractAddress}`

    try {
      const response = await this.retry<
        ExplorerApiResponse<ContractExplorerApiResponse>
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      return IndexerRestExplorerTransformer.contractToExplorerContract(
        response.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContracts(
    params?: {
      assetsOnly?: boolean
      fromNumber?: number
      codeId?: string | number
      limit?: number
      skip?: number
      label?: string
      token?: string
      lookup?: string
    },
    options?: RequestOptions,
  ): Promise<{
    paging: Paging
    contracts: Contract[]
  }> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/contracts`

    try {
      const {
        skip,
        limit,
        label,
        token,
        codeId,
        lookup,
        assetsOnly,
        fromNumber,
      } = params || {
        limit: 12,
      }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<ContractExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              label,
              token,
              lookup,
              assets_only: assetsOnly,
              from_number: fromNumber,
              code_id: codeId?.toString(),
            },
            requestConfig,
          ),
        options,
      )
      const { paging, data } = response.data

      return {
        paging,
        contracts: data
          ? data.map(IndexerRestExplorerTransformer.contractToExplorerContract)
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContractTransactions(
    {
      contractAddress,
      params,
    }: {
      contractAddress: string
      params?: {
        fromNumber?: number
        limit?: number
        toNumber?: number
        skip?: number
      }
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; transactions: ContractTransaction[] }> {
    throwIfAborted(options?.signal)
    const endpoint = `/contractTxs/${contractAddress}`

    try {
      const { fromNumber, limit, skip, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ContractTransactionExplorerApiResponse[]
        >
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              to_number: toNumber,
              from_number: fromNumber,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? data.map(
              IndexerRestExplorerTransformer.contractTransactionToExplorerContractTransaction,
            )
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContractTransactionsWithMessages(
    {
      contractAddress,
      params,
    }: {
      contractAddress: string
      params?: {
        fromNumber?: number
        limit?: number
        toNumber?: number
        skip?: number
      }
    },
    options?: RequestOptions,
  ): Promise<{
    paging: Paging
    transactions: ContractTransactionWithMessages[]
  }> {
    throwIfAborted(options?.signal)
    const endpoint = `/contractTxs/${contractAddress}`

    try {
      const { fromNumber, limit, skip, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ContractTransactionExplorerApiResponse[]
        >
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              to_number: toNumber,
              from_number: fromNumber,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? data.map(
              IndexerRestExplorerTransformer.contractTransactionToExplorerContractTransactionWithMessages,
            )
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchWasmCode(
    codeId: number,
    options?: RequestOptions,
  ): Promise<WasmCode> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/codes/${codeId}`

    try {
      const response = await this.retry<
        ExplorerApiResponse<WasmCodeExplorerApiResponse>
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      return IndexerRestExplorerTransformer.wasmCodeToExplorerWasmCode(
        response.data,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchWasmCodes(
    params?: {
      fromNumber?: number
      limit?: number
      toNumber?: number
    },
    options?: RequestOptions,
  ): Promise<{
    paging: Paging
    wasmCodes: WasmCode[]
  }> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/codes`

    try {
      const { fromNumber, limit, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<WasmCodeExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              limit,
              from_number: fromNumber,
              to_number: toNumber,
            },
            requestConfig,
          ),
        options,
      )

      const { paging, data } = response.data

      return {
        paging,
        wasmCodes: data
          ? data.map(IndexerRestExplorerTransformer.wasmCodeToExplorerWasmCode)
          : [],
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchCW20Balances(
    address: string,
    options?: RequestOptions,
  ): Promise<ExplorerCW20BalanceWithToken[]> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/${address}/cw20-balance`

    try {
      const response = await this.retry<
        ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      if (response.data.length === 0) {
        return []
      }

      return response.data.map(
        IndexerRestExplorerTransformer.CW20BalanceToExplorerCW20Balance,
      )
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchCW20BalancesNoThrow(
    address: string,
    options?: RequestOptions,
  ): Promise<CW20BalanceExplorerApiResponse[]> {
    throwIfAborted(options?.signal)
    const endpoint = `/wasm/${address}/cw20-balance`

    try {
      const response = await this.retry<
        ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>
      >((requestConfig) => this.get(endpoint, {}, requestConfig), options)

      if (response.data.length === 0) {
        return []
      }

      return response.data
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }

      const error = e as any

      if (error.message.includes(404) || error.message.includes(500)) {
        return []
      }

      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchBankTransfers(
    params: {
      limit?: number
      skip?: number
      startTime?: number
      endTime?: number
      address?: string
      isCommunitySpendPool?: boolean
      senders?: string
      recipients?: string
    },
    options?: RequestOptions,
  ): Promise<{ paging: Paging; data: BankTransfer[] }> {
    throwIfAborted(options?.signal)
    const endpoint = `/bank/transfers`

    const { endTime, limit, skip, startTime, address, recipients, senders } =
      params || { limit: 10 }

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<BankTransferFromExplorerApiResponse[]>
      >(
        (requestConfig) =>
          this.get(
            endpoint,
            {
              skip,
              limit,
              senders,
              address,
              recipients,
              end_time: endTime,
              start_time: startTime,
              is_community_pool_related: params.isCommunitySpendPool,
            },
            requestConfig,
          ),
        options,
      )

      const { data, paging } = response.data

      return {
        paging,
        data: IndexerRestExplorerTransformer.bankTransfersToBankTransfers(
          data || [],
        ),
      }
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }
}
