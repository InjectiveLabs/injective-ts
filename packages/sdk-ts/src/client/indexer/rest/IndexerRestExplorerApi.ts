import BaseRestConsumer from '../../BaseRestConsumer'
import {
  Paging,
  ExplorerTransaction,
  ExplorerApiResponse,
  ExplorerBlockWithTxs,
  ExplorerValidatorUptime,
  ContractExplorerApiResponse,
  BlockFromExplorerApiResponse,
  CW20BalanceExplorerApiResponse,
  ExplorerApiResponseWithPagination,
  TransactionFromExplorerApiResponse,
  ValidatorUptimeFromExplorerApiResponse,
  ContractTransactionExplorerApiResponse,
  WasmCodeExplorerApiResponse,
} from '../types/explorer-rest'
import {
  Contract,
  WasmCode,
  ContractTransaction,
  ExplorerCW20BalanceWithToken,
} from '../types/explorer'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { IndexerRestExplorerTransformer } from '../transformers'
import { Block, ExplorerValidator } from '../types/explorer'
import { IndexerModule } from '../types'
import { MsgStatus, MsgType } from '@injectivelabs/ts-types'

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
      const response = (await this.get(
        `blocks/${blockHashHeight}`,
      )) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse>

      return IndexerRestExplorerTransformer.blockWithTxToBlockWithTx(
        response.data.data,
      )
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchBlocks(params?: {
    before?: number
    limit?: number
  }): Promise<{ paging: Paging; blocks: Block[] }> {
    try {
      const { before, limit } = params || { limit: 12 }
      const response = (await this.get('blocks', {
        before,
        limit,
      })) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>

      const { paging, data } = response.data

      return {
        paging,
        blocks: IndexerRestExplorerTransformer.blocksToBlocks(data),
      }
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchBlocksWithTx(params?: {
    before?: number
    limit?: number
  }): Promise<{ paging: Paging; blocks: ExplorerBlockWithTxs[] }> {
    try {
      const { before, limit } = params || { limit: 12 }
      const response = (await this.get('blocks', {
        before,
        limit,
      })) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>

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

      throw new HttpRequestException(new Error((e as any).message), {
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
        fromNumber,
        before,
        after,
        limit,
        toNumber,
        endTime,
        skip,
        startTime,
        status,
        type,
      } = params || {
        limit: 12,
      }

      const response = (await this.get(endpoint, {
        limit,
        after,
        before,
        from_number: fromNumber,
        to_number: toNumber,
        skip,
        status,
        type: type ? type.join(',') : undefined,
        end_time: endTime,
        start_time: startTime,
      })) as ExplorerApiResponseWithPagination<
        TransactionFromExplorerApiResponse[]
      >

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

      throw new HttpRequestException(new Error((e as any).message), {
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
    }
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    const endpoint = `accountTxs/${account}`

    try {
      const {
        fromNumber,
        before,
        after,
        limit,
        skip,
        toNumber,
        endTime,
        startTime,
        status,
        type,
      } = params || {
        limit: 12,
      }
      const response = (await this.get(endpoint, {
        skip,
        limit,
        after,
        before,
        from_number: fromNumber,
        to_number: toNumber,
        status,
        type: type ? type.join(',') : undefined,
        end_time: endTime,
        start_time: startTime,
      })) as ExplorerApiResponseWithPagination<
        TransactionFromExplorerApiResponse[]
      >
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

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchTransaction(hash: string): Promise<ExplorerTransaction> {
    const endpoint = `txs/${hash}`

    try {
      const response = (await this.get(
        endpoint,
      )) as ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse>

      return IndexerRestExplorerTransformer.transactionToTransaction(
        response.data.data,
      )
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchValidators(): Promise<Partial<ExplorerValidator>[]> {
    const endpoint = 'validators'

    try {
      const response = (await this.get(
        endpoint,
      )) as ExplorerApiResponseWithPagination<any[]>

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

      throw new HttpRequestException(new Error((e as any).message), {
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
      const response = (await this.get(
        endpoint,
      )) as ExplorerApiResponseWithPagination<
        ValidatorUptimeFromExplorerApiResponse[]
      >

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

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContract(contractAddress: string): Promise<Contract> {
    const endpoint = `/wasm/contracts/${contractAddress}`

    try {
      const response = (await this.get(
        endpoint,
      )) as ExplorerApiResponse<ContractExplorerApiResponse>

      return IndexerRestExplorerTransformer.contractToExplorerContract(
        response.data,
      )
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchContracts(params?: {
    assetsOnly?: boolean
    fromNumber?: number
    limit?: number
    skip?: number
  }): Promise<{
    paging: Paging
    contracts: Contract[]
  }> {
    const endpoint = `/wasm/contracts`

    try {
      const { assetsOnly, fromNumber, limit, skip } = params || { limit: 12 }
      const response = (await this.get(endpoint, {
        skip,
        limit,
        assets_only: assetsOnly,
        from_number: fromNumber,
      })) as ExplorerApiResponseWithPagination<ContractExplorerApiResponse[]>

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

      throw new HttpRequestException(new Error((e as any).message), {
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
      const response = (await this.get(endpoint, {
        skip,
        limit,
        to_number: toNumber,
        from_number: fromNumber,
      })) as ExplorerApiResponseWithPagination<
        ContractTransactionExplorerApiResponse[]
      >

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

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchWasmCode(codeId: number): Promise<WasmCode> {
    const endpoint = `/wasm/codes/${codeId}`

    try {
      const response = (await this.get(
        endpoint,
      )) as ExplorerApiResponse<WasmCodeExplorerApiResponse>

      return IndexerRestExplorerTransformer.wasmCodeToExplorerWasmCode(
        response.data,
      )
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
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
      const response = (await this.get(endpoint, {
        limit,
        from_number: fromNumber,
        to_number: toNumber,
      })) as ExplorerApiResponseWithPagination<WasmCodeExplorerApiResponse[]>

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

      throw new HttpRequestException(new Error((e as any).message), {
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
      const response = (await this.get(endpoint)) as ExplorerApiResponse<
        CW20BalanceExplorerApiResponse[]
      >

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

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }

  async fetchCW20BalancesNoThrow(
    address: string,
  ): Promise<ExplorerCW20BalanceWithToken[]> {
    const endpoint = `/wasm/${address}/cw20-balance`

    try {
      const response = (await this.get(endpoint)) as ExplorerApiResponse<
        CW20BalanceExplorerApiResponse[]
      >

      if (response.data.length === 0) {
        return []
      }

      return response.data.map(
        IndexerRestExplorerTransformer.CW20BalanceToExplorerCW20Balance,
      )
    } catch (e: unknown) {
      const error = e as any

      if (error.message.includes(404) || error.message.includes(500)) {
        return []
      }

      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: IndexerModule.Explorer,
      })
    }
  }
}
