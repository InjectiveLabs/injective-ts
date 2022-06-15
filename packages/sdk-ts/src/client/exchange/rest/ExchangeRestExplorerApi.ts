import BaseRestConsumer from '../../BaseRestConsumer'
import {
  BlockFromExplorerApiResponse,
  ContractExplorerApiResponse,
  ContractTransactionExplorerApiResponse,
  ExplorerApiResponse,
  ExplorerApiResponseWithPagination,
  ExplorerBlockWithTxs,
  ExplorerTransaction,
  ExplorerValidatorUptime,
  Paging,
  TransactionFromExplorerApiResponse,
  ValidatorUptimeFromExplorerApiResponse,
  WasmCodeExplorerApiResponse,
} from '../types/explorer-rest'
import { Contract, ContractTransaction, WasmCode } from '../types/explorer'
import {
  BlockNotFoundException,
  TransactionNotFoundException,
  HttpException,
} from '@injectivelabs/exceptions'
import { ExchangeRestExplorerTransformer } from '../transformers'
import { Block, ExplorerValidator } from '../types/explorer'

export class ExchangeRestExplorerApi extends BaseRestConsumer {
  async fetchBlock(blockHashHeight: string): Promise<ExplorerBlockWithTxs> {
    try {
      const response = (await this.client.get(
        `blocks/${blockHashHeight}`,
      )) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse>

      return ExchangeRestExplorerTransformer.blockWithTxToBlockWithTx(
        response.data.data,
      )
    } catch (error: any) {
      if (error.response.status === 404) {
        throw new BlockNotFoundException(error.message)
      } else {
        throw new HttpException(error.message)
      }
    }
  }

  async fetchBlocks(params?: {
    before?: number
    limit?: number
    skip?: number
  }): Promise<Block[]> {
    try {
      const { before, limit, skip } = params || { limit: 12 }
      const response = (await this.client.get('blocks', {
        before,
        limit,
        skip,
      })) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>

      return ExchangeRestExplorerTransformer.blocksToBlocks(response.data.data)
    } catch (error) {
      throw new HttpException((error as any).message)
    }
  }

  async fetchBlocksWithTx(params?: {
    before?: number
    limit?: number
  }): Promise<{ paging: Paging; blocks: ExplorerBlockWithTxs[] }> {
    try {
      const { before, limit } = params || { limit: 50 }
      const response = (await this.client.get('blocks', {
        limit,
        before,
      })) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>

      const { paging, data } = response.data

      return {
        paging,
        blocks: data
          ? ExchangeRestExplorerTransformer.blocksWithTxsToBlocksWithTxs(data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchTransactions(params?: {
    before?: number
    limit?: number
    skip?: number
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    try {
      const { before, limit, skip } = params || { limit: 12 }
      const response = (await this.client.get('txs', {
        before,
        limit,
        skip,
      })) as ExplorerApiResponseWithPagination<
        TransactionFromExplorerApiResponse[]
      >

      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? ExchangeRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchAccountTransactions({
    account,
    params,
  }: {
    account: string
    params?: {
      before?: number
      limit?: number
      skip?: number
    }
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    try {
      const { before, limit, skip } = params || { limit: 12 }
      const response = (await this.client.get(`accountTxs/${account}`, {
        before,
        limit,
        skip,
      })) as ExplorerApiResponseWithPagination<
        TransactionFromExplorerApiResponse[]
      >
      const { paging, data } = response.data

      return {
        paging,
        transactions: data
          ? ExchangeRestExplorerTransformer.transactionsToTransactions(data)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchTransaction(hash: string): Promise<ExplorerTransaction> {
    try {
      const response = (await this.client.get(
        `txs/${hash}`,
      )) as ExplorerApiResponseWithPagination<TransactionFromExplorerApiResponse>

      return ExchangeRestExplorerTransformer.transactionToTransaction(
        response.data.data,
      )
    } catch (error: any) {
      if (error.response.status === 404) {
        throw new TransactionNotFoundException(error.message)
      } else {
        throw new HttpException(error.message)
      }
    }
  }

  async fetchValidators(): Promise<Partial<ExplorerValidator>[]> {
    try {
      const response = (await this.client.get(
        `validators`,
      )) as ExplorerApiResponseWithPagination<any[]>

      if (!response.data || !response.data.data) {
        return []
      }

      return ExchangeRestExplorerTransformer.validatorExplorerToValidator(
        response.data.data,
      )
    } catch (error) {
      throw new HttpException((error as any).message)
    }
  }

  async fetchValidatorUptime(
    validatorConsensusAddress: string,
  ): Promise<ExplorerValidatorUptime[]> {
    try {
      const response = (await this.client.get(
        `validator_uptime/${validatorConsensusAddress}`,
      )) as ExplorerApiResponseWithPagination<
        ValidatorUptimeFromExplorerApiResponse[]
      >

      if (!response.data || !response.data.data) {
        return []
      }

      return ExchangeRestExplorerTransformer.validatorUptimeToExplorerValidatorUptime(
        response.data.data,
      )
    } catch (error) {
      throw new HttpException((error as any).message)
    }
  }

  async fetchContract(contractAddress: string): Promise<Contract> {
    try {
      const response = (await this.client.get(
        `/wasm/contracts/${contractAddress}`,
      )) as ExplorerApiResponse<ContractExplorerApiResponse>

      return ExchangeRestExplorerTransformer.contractToExplorerContract(
        response.data,
      )
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchContracts(params?: {
    before?: number
    limit?: number
    skip?: number
  }): Promise<{
    paging: Paging
    contracts: Contract[]
  }> {
    try {
      const { before, limit, skip } = params || { limit: 12 }
      const response = (await this.client.get('/wasm/contracts', {
        before,
        limit,
        skip,
      })) as ExplorerApiResponseWithPagination<ContractExplorerApiResponse[]>

      const { paging, data } = response.data

      return {
        paging,
        contracts: data
          ? data.map(ExchangeRestExplorerTransformer.contractToExplorerContract)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchContractTransactions(
    contractAddress: string,
  ): Promise<{ paging: Paging; transactions: ContractTransaction[] }> {
    try {
      const response = (await this.client.get(
        `/txs?contract_address=${contractAddress}`,
      )) as ExplorerApiResponseWithPagination<
        ContractTransactionExplorerApiResponse[]
      >

      const { paging, data } = response.data
      return {
        paging,
        transactions: data
          ? data.map(
              ExchangeRestExplorerTransformer.contractTransactionToExplorerContractTransaction,
            )
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchWasmCode(codeId: number): Promise<WasmCode> {
    try {
      const response = (await this.client.get(
        `/wasm/codes/${codeId}`,
      )) as ExplorerApiResponse<WasmCodeExplorerApiResponse>

      return ExchangeRestExplorerTransformer.wasmCodeToExplorerWasmCode(
        response.data,
      )
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchWasmCodes(params?: {
    before?: number
    limit?: number
    skip?: number
  }): Promise<{
    paging: Paging
    wasmCodes: WasmCode[]
  }> {
    try {
      const { before, limit, skip } = params || { limit: 12 }
      const response = (await this.client.get('/wasm/codes', {
        before,
        limit,
        skip,
      })) as ExplorerApiResponseWithPagination<WasmCodeExplorerApiResponse[]>

      const { paging, data } = response.data

      return {
        paging,
        wasmCodes: data
          ? data.map(ExchangeRestExplorerTransformer.wasmCodeToExplorerWasmCode)
          : [],
      }
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }
}
