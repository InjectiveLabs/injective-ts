import { fromUtf8, uint8ArrayToString } from '../../../utils/index.js'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as CosmwasmWasmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/query_pb'
import type {
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
} from '../types/wasm.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcWasmTransformer {
  static allContractStateResponseToContractAccountsBalanceWithPagination(
    response: CosmwasmWasmV1QueryPb.QueryAllContractStateResponse,
  ): ContractAccountsBalanceWithPagination {
    const contractAccountsBalance = response.models
      .map((model) => {
        return {
          account: uint8ArrayToString(model.key).split('balance').pop(),
          balance: uint8ArrayToString(model.value).replace(/['"]+/g, ''),
        }
      })
      .filter(({ account, balance }) => {
        return account && account.startsWith('inj') && balance
      }) as ContractAccountBalance[]

    const contractInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'contract_info'
    })
    const contractInfoValue = uint8ArrayToString(
      contractInfoModel?.value || new Uint8Array(),
    )

    const tokenInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'token_info'
    })
    const tokenInfoValue = uint8ArrayToString(
      tokenInfoModel?.value || new Uint8Array(),
    )

    const marketingInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'marketing_info'
    })
    const marketingInfoValue = uint8ArrayToString(
      marketingInfoModel?.value || new Uint8Array(),
    )

    return {
      contractAccountsBalance,
      tokenInfo: JSON.parse(tokenInfoValue || '{}') as TokenInfo,
      contractInfo: JSON.parse(contractInfoValue || '{}') as ContractInfo,
      marketingInfo: JSON.parse(marketingInfoValue || '{}') as MarketingInfo,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static allContractStateResponseToContractState(
    response: CosmwasmWasmV1QueryPb.QueryAllContractStateResponse,
  ): ContractStateWithPagination {
    const contractAccountsBalance = response.models
      .map((model) => {
        return {
          account: uint8ArrayToString(model.key).split('balance').pop(),
          balance: uint8ArrayToString(model.value).replace(/['"]+/g, ''),
        }
      })
      .filter(({ account, balance }) => {
        return account && account.startsWith('inj') && balance
      }) as ContractAccountBalance[]

    const contractInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'contract_info'
    })
    const contractInfoValue = uint8ArrayToString(
      contractInfoModel?.value || new Uint8Array(),
    )

    const tokenInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'token_info'
    })
    const tokenInfoValue = uint8ArrayToString(
      tokenInfoModel?.value || new Uint8Array(),
    )

    const marketingInfoModel = response.models.find((model) => {
      return uint8ArrayToString(model.key) === 'marketing_info'
    })
    const marketingInfoValue = uint8ArrayToString(
      marketingInfoModel?.value || new Uint8Array(),
    )

    return {
      contractAccountsBalance,
      tokenInfo: JSON.parse(tokenInfoValue || '{}') as TokenInfo,
      contractInfo: JSON.parse(contractInfoValue || '{}') as ContractInfo,
      marketingInfo: JSON.parse(marketingInfoValue || '{}') as MarketingInfo,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static contactInfoResponseToContractInfo(
    contractInfo: grpcContractInfo,
  ): ContractInfo {
    const absoluteTxPosition = contractInfo.created

    return {
      codeId: Number(contractInfo.codeId),
      creator: contractInfo.creator,
      admin: contractInfo.admin,
      label: contractInfo.label,
      created: absoluteTxPosition
        ? {
            blockHeight: Number(absoluteTxPosition.blockHeight),
            txIndex: Number(absoluteTxPosition.txIndex),
          }
        : undefined,
      ibcPortId: contractInfo.ibcPortId,
    }
  }

  static grpcContractCodeHistoryEntryToContractCodeHistoryEntry(
    entry: GrpcContractCodeHistoryEntry,
  ): ContractCodeHistoryEntry {
    const updated = entry.updated

    return {
      operation: entry.operation,
      codeId: Number(entry.codeId),
      updated: updated
        ? {
            blockHeight: Number(updated.blockHeight),
            txIndex: Number(updated.txIndex),
          }
        : undefined,
      msg: fromUtf8(entry.msg),
    }
  }

  static grpcCodeInfoResponseToCodeInfoResponse(
    info: GrpcCodeInfoResponse,
  ): CodeInfoResponse {
    return {
      codeId: Number(info.codeId),
      creator: info.creator,
      dataHash: info.dataHash,
    }
  }

  static contactHistoryResponseToContractHistory(
    response: CosmwasmWasmV1QueryPb.QueryContractHistoryResponse,
  ) {
    return {
      entriesList: response.entries.map(
        ChainGrpcWasmTransformer.grpcContractCodeHistoryEntryToContractCodeHistoryEntry,
      ),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static contractCodesResponseToContractCodes(
    response: CosmwasmWasmV1QueryPb.QueryCodesResponse,
  ) {
    return {
      codeInfosList: response.codeInfos.map(
        ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse,
      ),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static contractCodeResponseToContractCode(
    response: CosmwasmWasmV1QueryPb.QueryCodeResponse,
  ) {
    return {
      codeInfo: ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse(
        response.codeInfo!,
      ),
      data: response.data,
    }
  }

  static contractByCodeResponseToContractByCode(
    response: CosmwasmWasmV1QueryPb.QueryContractsByCodeResponse,
  ) {
    return {
      contractsList: response.contracts,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }
}
