import { Query as BankQuery } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb_service'
import {
  QueryAllBalancesRequest,
  QueryAllBalancesResponse,
  QueryBalanceRequest,
  QueryBalanceResponse,
  QueryTotalSupplyRequest,
  QueryTotalSupplyResponse,
  QueryParamsRequest as QueryBankParamsRequest,
  QueryParamsResponse as QueryBankParamsResponse,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcBankTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi extends BaseConsumer {
  protected module: string = ChainModule.Bank

  async fetchModuleParams() {
    const request = new QueryBankParamsRequest()

    try {
      const response = await this.request<
        QueryBankParamsRequest,
        QueryBankParamsResponse,
        typeof BankQuery.Params
      >(request, BankQuery.Params)

      return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: string
    denom: string
  }) {
    const request = new QueryBalanceRequest()
    request.setAddress(accountAddress)
    request.setDenom(denom)

    try {
      const response = await this.request<
        QueryBalanceRequest,
        QueryBalanceResponse,
        typeof BankQuery.Balance
      >(request, BankQuery.Balance)

      return ChainGrpcBankTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBalances(address: string) {
    const request = new QueryAllBalancesRequest()
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryAllBalancesRequest,
        QueryAllBalancesResponse,
        typeof BankQuery.AllBalances
      >(request, BankQuery.AllBalances)

      return ChainGrpcBankTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchTotalSupply(pagination?: PaginationOption) {
    const request = new QueryTotalSupplyRequest()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryTotalSupplyRequest,
        QueryTotalSupplyResponse,
        typeof BankQuery.TotalSupply
      >(request, BankQuery.TotalSupply)

      return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
