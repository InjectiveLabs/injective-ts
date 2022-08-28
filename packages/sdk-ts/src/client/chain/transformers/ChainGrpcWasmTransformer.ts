import {
  QueryAllContractStateResponse,
  QueryCodeResponse,
  QueryCodesResponse,
  QueryContractHistoryResponse,
  QueryContractsByCodeResponse,
} from '@injectivelabs/chain-api/cosmwasm/wasm/v1/query_pb'
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
    const contractAccountsBalance = response
      .getModelsList()
      .map((model) => {
        return {
          account: Buffer.from(model.getKey_asB64(), 'base64')
            .toString('utf-8')
            .split('balance')
            .pop(),
          balance: Buffer.from(model.getValue_asB64(), 'base64')
            .toString('utf-8')
            .replace(/['"]+/g, ''),
        }
      })
      .filter(({ account }) => {
        return account && account.startsWith('inj')
      }) as ContractAccountBalance[]

    return {
      contractAccountsBalance,
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static contactInfoResponseToContractInfo(
    contractInfo: grpcContractInfo,
  ): ContractInfo {
    const absoluteTxPosition = contractInfo.getCreated()

    return {
      codeId: contractInfo.getCodeId(),
      creator: contractInfo.getCreator(),
      admin: contractInfo.getAdmin(),
      label: contractInfo.getLabel(),
      created: {
        blockHeight: absoluteTxPosition
          ? absoluteTxPosition.getBlockHeight()
          : 0,
        txIndex: absoluteTxPosition ? absoluteTxPosition.getTxIndex() : 0,
      },
      ibcPortId: contractInfo.getIbcPortId(),
    }
  }

  static grpcContractCodeHistoryEntryToContractCodeHistoryEntry(
    entry: GrpcContractCodeHistoryEntry,
  ): ContractCodeHistoryEntry {
    const updated = entry.getUpdated()

    return {
      operation: entry.getOperation(),
      codeId: entry.getCodeId(),
      updated: updated
        ? {
            blockHeight: updated.getBlockHeight(),
            txIndex: updated.getTxIndex(),
          }
        : undefined,
      msg: fromUtf8(entry.getMsg_asU8()),
    }
  }

  static grpcCodeInfoResponseToCodeInfoResponse(
    info: GrpcCodeInfoResponse,
  ): CodeInfoResponse {
    return {
      codeId: info.getCodeId(),
      creator: info.getCreator(),
      dataHash: info.getDataHash(),
    }
  }

  static contactHistoryResponseToContractHistory(
    response: QueryContractHistoryResponse,
  ) {
    return {
      entriesList: response
        .getEntriesList()
        .map(
          ChainGrpcWasmTransformer.grpcContractCodeHistoryEntryToContractCodeHistoryEntry,
        ),
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static contractCodesResponseToContractCodes(response: QueryCodesResponse) {
    return {
      codeInfosList: response
        .getCodeInfosList()
        .map(ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse),
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static contractCodeResponseToContractCode(response: QueryCodeResponse) {
    return {
      codeInfo: ChainGrpcWasmTransformer.grpcCodeInfoResponseToCodeInfoResponse(
        response.getCodeInfo()!,
      ),
      data: response.getData(),
    }
  }

  static contractByCodeResponseToContractByCode(
    response: QueryContractsByCodeResponse,
  ) {
    return {
      contractsList: response.getContractsList(),
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }
}
