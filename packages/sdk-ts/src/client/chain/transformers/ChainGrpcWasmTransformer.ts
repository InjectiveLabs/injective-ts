import {
  QueryAllContractStateResponse,
  QueryCodeResponse,
  QueryCodesResponse,
  QueryContractHistoryResponse,
  QueryContractsByCodeResponse,
} from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/query'
import {
  ContractAccountBalance,
  ContractAccountsBalanceWithPagination,
  ContractCodeHistoryEntry,
  ContractInfo,
  GrpcContractCodeHistoryEntry,
  grpcContractInfo,
  CodeInfoResponse,
  GrpcCodeInfoResponse,
} from '../types/wasm'
import { fromUtf8 } from '../../../utils'
import { grpcPaginationToPagination } from './../../../utils/pagination'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcWasmTransformer {
  static allContractStateResponseToContractAccountsBalanceWithPagination(
    response: QueryAllContractStateResponse,
  ): ContractAccountsBalanceWithPagination {
    const contractAccountsBalance = response.models
      .map((model) => {
        return {
          account: Buffer.from(model.key)
            .toString('utf-8')
            .split('balance')
            .pop(),
          balance: Buffer.from(model.key)
            .toString('utf-8')
            .replace(/['"]+/g, ''),
        }
      })
      .filter(({ account }) => {
        return account && account.startsWith('inj')
      }) as ContractAccountBalance[]

    return {
      contractAccountsBalance,
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
    response: QueryContractHistoryResponse,
  ) {
    return {
      entriesList: response.entries.map(
        ChainGrpcWasmTransformer.grpcContractCodeHistoryEntryToContractCodeHistoryEntry,
      ),
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static contractCodesResponseToContractCodes(response: QueryCodesResponse) {
    return {
      codeInfosList: response.codeInfos.map(
        ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse,
      ),
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }

  static contractCodeResponseToContractCode(response: QueryCodeResponse) {
    return {
      codeInfo: ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse(
        response.codeInfo!,
      ),
      data: response.data,
    }
  }

  static contractByCodeResponseToContractByCode(
    response: QueryContractsByCodeResponse,
  ) {
    return {
      contractsList: response.contracts,
      pagination: grpcPaginationToPagination(response.pagination),
    }
  }
}
