import {
  TokenInfo,
  ContractInfo,
  MarketingInfo,
  CodeInfoResponse,
  grpcContractInfo,
  GrpcCodeInfoResponse,
  ContractAccountBalance,
  ContractCodeHistoryEntry,
  ContractStateWithPagination,
  GrpcContractCodeHistoryEntry,
  ContractAccountsBalanceWithPagination,
} from '../types/wasm'
import { fromUtf8 } from '../../../utils'
import { grpcPaginationToPagination } from './../../../utils/pagination'
import { CosmwasmWasmV1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcWasmTransformer {
  static allContractStateResponseToContractAccountsBalanceWithPagination(
    response: CosmwasmWasmV1Query.QueryAllContractStateResponse,
  ): ContractAccountsBalanceWithPagination {
    const contractAccountsBalance = response.models
      .map((model) => {
        return {
          account: Buffer.from(model.key)
            .toString('utf-8')
            .split('balance')
            .pop(),
          balance: Buffer.from(model.value)
            .toString('utf-8')
            .replace(/['"]+/g, ''),
        }
      })
      .filter(({ account, balance }) => {
        return account && account.startsWith('inj') && balance
      }) as ContractAccountBalance[]

    const contractInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'contract_info'
    })
    const contractInfoValue = Buffer.from(
      contractInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    const tokenInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'token_info'
    })
    const tokenInfoValue = Buffer.from(
      tokenInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    const marketingInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'marketing_info'
    })
    const marketingInfoValue = Buffer.from(
      marketingInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    return {
      contractAccountsBalance,
      tokenInfo: JSON.parse(tokenInfoValue || '{}') as TokenInfo,
      contractInfo: JSON.parse(contractInfoValue || '{}') as ContractInfo,
      marketingInfo: JSON.parse(marketingInfoValue || '{}') as MarketingInfo,
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static allContractStateResponseToContractState(
    response: CosmwasmWasmV1Query.QueryAllContractStateResponse,
  ): ContractStateWithPagination {
    const contractAccountsBalance = response.models
      .map((model) => {
        return {
          account: Buffer.from(model.key)
            .toString('utf-8')
            .split('balance')
            .pop(),
          balance: Buffer.from(model.value)
            .toString('utf-8')
            .replace(/['"]+/g, ''),
        }
      })
      .filter(({ account, balance }) => {
        return account && account.startsWith('inj') && balance
      }) as ContractAccountBalance[]

    const contractInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'contract_info'
    })
    const contractInfoValue = Buffer.from(
      contractInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    const tokenInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'token_info'
    })
    const tokenInfoValue = Buffer.from(
      tokenInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    const marketingInfoModel = response.models.find((model) => {
      return Buffer.from(model.key).toString('utf-8') === 'marketing_info'
    })
    const marketingInfoValue = Buffer.from(
      marketingInfoModel?.value || new Uint8Array(),
    ).toString('utf-8')

    return {
      contractAccountsBalance,
      tokenInfo: JSON.parse(tokenInfoValue || '{}') as TokenInfo,
      contractInfo: JSON.parse(contractInfoValue || '{}') as ContractInfo,
      marketingInfo: JSON.parse(marketingInfoValue || '{}') as MarketingInfo,
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static contactInfoResponseToContractInfo(
    contractInfo: grpcContractInfo,
  ): ContractInfo {
    const absoluteTxPosition = contractInfo.created

    return {
      codeId: parseInt(contractInfo.codeId, 10),
      creator: contractInfo.creator,
      admin: contractInfo.admin,
      label: contractInfo.label,
      created: {
        blockHeight: parseInt(
          absoluteTxPosition ? absoluteTxPosition.blockHeight : '0',
        ),
        txIndex: parseInt(
          absoluteTxPosition ? absoluteTxPosition.txIndex : '0',
        ),
      },
      ibcPortId: contractInfo.ibcPortId,
    }
  }

  static grpcContractCodeHistoryEntryToContractCodeHistoryEntry(
    entry: GrpcContractCodeHistoryEntry,
  ): ContractCodeHistoryEntry {
    const updated = entry.updated

    return {
      operation: entry.operation,
      codeId: parseInt(entry.codeId, 10),
      updated: updated
        ? {
            blockHeight: parseInt(updated.blockHeight, 10),
            txIndex: parseInt(updated.txIndex, 10),
          }
        : undefined,
      msg: fromUtf8(entry.msg),
    }
  }

  static grpcCodeInfoResponseToCodeInfoResponse(
    info: GrpcCodeInfoResponse,
  ): CodeInfoResponse {
    return {
      codeId: parseInt(info.codeId, 10),
      creator: info.creator,
      dataHash: info.dataHash,
    }
  }

  static contactHistoryResponseToContractHistory(
    response: CosmwasmWasmV1Query.QueryContractHistoryResponse,
  ) {
    return {
      entriesList: response.entries.map(
        ChainGrpcWasmTransformer.grpcContractCodeHistoryEntryToContractCodeHistoryEntry,
      ),
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static contractCodesResponseToContractCodes(
    response: CosmwasmWasmV1Query.QueryCodesResponse,
  ) {
    return {
      codeInfosList: response.codeInfos.map(
        ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse,
      ),
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static contractCodeResponseToContractCode(
    response: CosmwasmWasmV1Query.QueryCodeResponse,
  ) {
    return {
      codeInfo: ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse(
        response.codeInfo!,
      ),
      data: response.data,
    }
  }

  static contractByCodeResponseToContractByCode(
    response: CosmwasmWasmV1Query.QueryContractsByCodeResponse,
  ) {
    return {
      contractsList: response.contracts,
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }
}
