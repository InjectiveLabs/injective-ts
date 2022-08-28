import BaseRestConsumer from '../../BaseRestConsumer'
import {
  BlockFromExplorerApiResponse,
  ContractExplorerApiResponse,
  ContractTransactionExplorerApiResponse,
  CW20BalanceExplorerApiResponse,
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
import {
  Contract,
  ContractTransaction,
  CW20BalanceWithToken,
  WasmCode,
} from '../types/explorer'
import {
  BlockNotFoundException,
  TransactionNotFoundException,
  HttpException,
} from '@injectivelabs/exceptions'
import { ExchangeRestExplorerTransformer } from '../transformers'
import { Block, ExplorerValidator } from '../types/explorer'

/**
 * @category Exchange Rest API
 */
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
  }): Promise<{ paging: Paging; blocks: Block[] }> {
    try {
      const { before, limit } = params || { limit: 12 }
      const response = (await this.client.get('blocks', {
        before,
        limit,
      })) as ExplorerApiResponseWithPagination<BlockFromExplorerApiResponse[]>

      const { paging, data } = response.data

      return {
        paging,
        blocks: ExchangeRestExplorerTransformer.blocksToBlocks(data),
      }
    } catch (error) {
      throw new HttpException((error as any).message)
    }
  }

  async fetchBlocksWithTx(params?: {
    before?: number
    limit?: number
  }): Promise<{ paging: Paging; blocks: ExplorerBlockWithTxs[] }> {
    try {
      const { before, limit } = params || { limit: 12 }
      const response = (await this.client.get('blocks', {
        before,
        limit,
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
    from_number?: number
    limit?: number
    to_number?: number
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    try {
      const { from_number, limit, to_number } = params || { limit: 12 }
      const response = (await this.client.get('txs', {
        from_number,
        limit,
        to_number,
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
      from_number?: number
      limit?: number
      to_number?: number
      skip?: number
    }
  }): Promise<{ paging: Paging; transactions: ExplorerTransaction[] }> {
    try {
      const { from_number, limit, skip, to_number } = params || { limit: 12 }
      const response = (await this.client.get(`accountTxs/${account}`, {
        from_number,
        limit,
        skip,
        to_number,
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
    from_number?: number
    limit?: number
    to_number?: number
  }): Promise<{
    paging: Paging
    contracts: Contract[]
  }> {
    try {
      const { from_number, limit, to_number } = params || { limit: 12 }
      const response = (await this.client.get('/wasm/contracts', {
        from_number,
        limit,
        to_number,
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

  async fetchContractTransactions({
    contractAddress,
    params,
  }: {
    contractAddress: string
    params?: {
      from_number?: number
      limit?: number
      to_number?: number
      skip?: number
    }
  }): Promise<{ paging: Paging; transactions: ContractTransaction[] }> {
    try {
      const { from_number, limit, skip, to_number } = params || { limit: 12 }
      const response = (await this.client.get(
        `/contractTxs/${contractAddress}`,
        {
          from_number,
          limit,
          skip,
          to_number,
        },
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
    from_number?: number
    limit?: number
    to_number?: number
  }): Promise<{
    paging: Paging
    wasmCodes: WasmCode[]
  }> {
    try {
      const { from_number, limit, to_number } = params || { limit: 12 }
      const response = (await this.client.get('/wasm/codes', {
        from_number,
        limit,
        to_number,
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

  async fetchCW20Balances(address: string): Promise<CW20BalanceWithToken[]> {
    try {
      const response = (await this.client.get(
        `/wasm/${address}/cw20-balance`,
      )) as ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>

      if (response.data.length === 0) {
        return []
      }

      return response.data.map(
        ExchangeRestExplorerTransformer.CW20BalanceToExplorerCW20Balance,
      )
    } catch (error: any) {
      throw new HttpException(error.message)
    }
  }

  async fetchCW20BalancesNoThrow(
    address: string,
  ): Promise<CW20BalanceWithToken[]> {
    try {
      const response = (await this.client.get(
        `/wasm/${address}/cw20-balance`,
      )) as ExplorerApiResponse<CW20BalanceExplorerApiResponse[]>

      if (response.data.length === 0) {
        return []
      }

      return response.data.map(
        ExchangeRestExplorerTransformer.CW20BalanceToExplorerCW20Balance,
      )
    } catch (error: any) {
      if (error.message.includes(404) || error.message.includes(500)) {
        return []
      }

      throw new HttpException(error.message)
    }
  }
}
