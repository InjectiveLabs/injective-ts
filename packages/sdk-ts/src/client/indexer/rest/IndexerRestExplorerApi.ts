import { MsgStatus, MsgType } from '@injectivelabs/ts-types'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
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
import {
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
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import { Block, ExplorerValidator } from '../types/explorer.js'
import { IndexerRestExplorerTransformer } from '../transformers/index.js'
import { IndexerModule } from '../types/index.js'

const explorerEndpointSuffix = 'api/explorer/v1'

/**
 * @category Indexer Rest API
 */
export class IndexerRestExplorerApi extends BaseRestConsumer {
  constructor(endpoint: string) {
    super(
      endpoint.includes(explorerEndpointSuffix)
        ? endpoint
        : `${endpoint}/${explorerEndpointSuffix}`,
    )
  }

  async fetchBlock(blockHashHeight: string): Promise<ExplorerBlockWithTxs> {
    const endpoint = `blocks/${blockHashHeight}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse>
      >(() => this.get(`blocks/${blockHashHeight}`))

      return IndexerRestExplorerTransformer.blockWithTxToBlockWithTx(
        response.data.data,
      )
    } catch (e: unknown) {
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

  async fetchBlocks(params?: {
    before?: number
    limit?: number
    from?: number
    to?: number
  }): Promise<{ paging: Paging; blocks: Block[] }> {
    const endpoint = 'blocks'

    try {
      const { before, limit, from, to } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>
      >(() =>
        this.get(endpoint, {
          before,
          limit,
          from,
          to,
        }),
      )

      const { paging, data } = response.data

      return {
        paging,
        blocks: IndexerRestExplorerTransformer.blocksToBlocks(data),
      }
    } catch (e: unknown) {
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

  async fetchBlocksWithTx(params?: {
    before?: number
    limit?: number
    from?: number
    to?: number
  }): Promise<{ paging: Paging; blocks: ExplorerBlockWithTxs[] }> {
    const endpoint = 'blocks'

    try {
      const { before, limit, from, to } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>
      >(() =>
        this.get(endpoint, {
          before,
          limit,
          from,
          to,
        }),
      )

      const { paging, data } = response.data

      return {
        paging,
        blocks: data
          ? IndexerRestExplorerTransformer.blocksWithTxsToBlocksWithTxs(data)
          : [],
      }
    } catch (e: unknown) {
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

  async fetchTransactions(params?: {
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
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
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
      >(() =>
        this.get(endpoint, {
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
        }),
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? IndexerRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (e: unknown) {
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

  async fetchAccountTransactions({
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
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
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
      >(() =>
        this.get(endpoint, {
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
        }),
      )

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? IndexerRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (e: unknown) {
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

  async fetchTransaction(hash: string): Promise<ExplorerTransaction> {
    const endpoint = `txs/${hash}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse>
      >(() => this.get(endpoint))

      return IndexerRestExplorerTransformer.transactionToTransaction(
        response.data.data,
      )
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchValidators(): Promise<Partial<ExplorerValidator>[]> {
    const endpoint = 'validators'

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<any[]>
      >(() => this.get(endpoint))

      if (!response.data || !response.data.data) {
        return []
      }

      return IndexerRestExplorerTransformer.validatorExplorerToValidator(
        response.data.data,
      )
    } catch (e: unknown) {
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

  async fetchValidatorUptime(
    validatorConsensusAddress: string,
  ): Promise<ExplorerValidatorUptime[]> {
    const endpoint = `validator_uptime/${validatorConsensusAddress}`

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ValidatorUptimeFromExplorerApiResponse[]
        >
      >(() => this.get(endpoint))

      if (!response.data || !response.data.data) {
        return []
      }

      return IndexerRestExplorerTransformer.validatorUptimeToExplorerValidatorUptime(
        response.data.data,
      )
    } catch (e: unknown) {
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

  async fetchContract(contractAddress: string): Promise<Contract> {
    const endpoint = `/wasm/contracts/${contractAddress}`

    try {
      const response = await this.retry<
        ExplorerApiResponse<ContractExplorerApiResponse>
      >(() => this.get(endpoint))

      return IndexerRestExplorerTransformer.contractToExplorerContract(
        response.data,
      )
    } catch (e: unknown) {
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

  async fetchContracts(params?: {
    assetsOnly?: boolean
    fromNumber?: number
    codeId?: string | number
    limit?: number
    skip?: number
    label?: string
  }): Promise<{
    paging: Paging
    contracts: Contract[]
  }> {
    const endpoint = `/wasm/contracts`

    try {
      const { assetsOnly, fromNumber, limit, skip, label, codeId } = params || {
        limit: 12,
      }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<ContractExplorerApiResponse[]>
      >(() =>
        this.get(endpoint, {
          skip,
          limit,
          label,
          code_id: codeId?.toString(),
          assets_only: assetsOnly,
          from_number: fromNumber,
        }),
      )
      const { paging, data } = response.data

      return {
        paging,
        contracts: data
          ? data.map(IndexerRestExplorerTransformer.contractToExplorerContract)
          : [],
      }
    } catch (e: unknown) {
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

  async fetchContractTransactions({
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
  }): Promise<{ paging: Paging; transactions: ContractTransaction[] }> {
    const endpoint = `/contractTxs/${contractAddress}`

    try {
      const { fromNumber, limit, skip, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ContractTransactionExplorerApiResponse[]
        >
      >(() =>
        this.get(endpoint, {
          skip,
          limit,
          to_number: toNumber,
          from_number: fromNumber,
        }),
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

  async fetchContractTransactionsWithMessages({
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
  }): Promise<{
    paging: Paging
    transactions: ContractTransactionWithMessages[]
  }> {
    const endpoint = `/contractTxs/${contractAddress}`

    try {
      const { fromNumber, limit, skip, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<
          ContractTransactionExplorerApiResponse[]
        >
      >(() =>
        this.get(endpoint, {
          skip,
          limit,
          to_number: toNumber,
          from_number: fromNumber,
        }),
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

  async fetchWasmCode(codeId: number): Promise<WasmCode> {
    const endpoint = `/wasm/codes/${codeId}`

    try {
      const response = await this.retry<
        ExplorerApiResponse<WasmCodeExplorerApiResponse>
      >(() => this.get(endpoint))

      return IndexerRestExplorerTransformer.wasmCodeToExplorerWasmCode(
        response.data,
      )
    } catch (e: unknown) {
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

  async fetchWasmCodes(params?: {
    fromNumber?: number
    limit?: number
    toNumber?: number
  }): Promise<{
    paging: Paging
    wasmCodes: WasmCode[]
  }> {
    const endpoint = `/wasm/codes`

    try {
      const { fromNumber, limit, toNumber } = params || { limit: 12 }

      const response = await this.retry<
        ExplorerApiResponseWithPagination<WasmCodeExplorerApiResponse[]>
      >(() =>
        this.get(endpoint, {
          limit,
          from_number: fromNumber,
          to_number: toNumber,
        }),
      )

      const { paging, data } = response.data

      return {
        paging,
        wasmCodes: data
          ? data.map(IndexerRestExplorerTransformer.wasmCodeToExplorerWasmCode)
          : [],
      }
    } catch (e: unknown) {
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

  async fetchCW20Balances(
    address: string,
  ): Promise<ExplorerCW20BalanceWithToken[]> {
    const endpoint = `/wasm/${address}/cw20-balance`

    try {
      const response = await this.retry<
        ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>
      >(() => this.get(endpoint))

      if (response.data.length === 0) {
        return []
      }

      return response.data.map(
        IndexerRestExplorerTransformer.CW20BalanceToExplorerCW20Balance,
      )
    } catch (e: unknown) {
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

  async fetchCW20BalancesNoThrow(
    address: string,
  ): Promise<CW20BalanceExplorerApiResponse[]> {
    const endpoint = `/wasm/${address}/cw20-balance`

    try {
      const response = await this.retry<
        ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>
      >(() => this.get(endpoint))

      if (response.data.length === 0) {
        return []
      }

      return response.data
    } catch (e: unknown) {
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

  async fetchBankTransfers(params: {
    limit?: number
    skip?: number
    startTime?: number
    endTime?: number
    address?: string
    isCommunitySpendPool?: boolean
    senders?: string
    recipients?: string
  }): Promise<{ paging: Paging; data: BankTransfer[] }> {
    const endpoint = `/bank/transfers`

    const { endTime, limit, skip, startTime, address, recipients, senders } =
      params || { limit: 10 }

    try {
      const response = await this.retry<
        ExplorerApiResponseWithPagination<BankTransferFromExplorerApiResponse[]>
      >(() =>
        this.get(endpoint, {
          skip,
          limit,
          senders,
          address,
          recipients,
          end_time: endTime,
          start_time: startTime,
          is_community_pool_related: params.isCommunitySpendPool,
        }),
      )

      const { data, paging } = response.data

      return {
        paging,
        data: IndexerRestExplorerTransformer.bankTransfersToBankTransfers(
          data || [],
        ),
      }
    } catch (e: unknown) {
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
}
