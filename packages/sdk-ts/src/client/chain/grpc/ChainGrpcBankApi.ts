import {
  QueryClientImpl,
  QueryAllBalancesRequest,
  QueryBalanceRequest,
  QueryTotalSupplyRequest,
  QueryParamsRequest as QueryBankParamsRequest,
} from '@injectivelabs/core-proto-ts/cosmos/bank/v1beta1/query'
import { getRpcInterface } from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcBankTransformer } from '../transformers'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi {
  protected module: string = ChainModule.Bank

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryBankParamsRequest.create()

    try {
      const response = await this.query.Params(request)

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
    const request = QueryBalanceRequest.create()

    request.address = accountAddress
    request.denom = denom

    try {
      const response = await this.query.Balance(request)

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
    const request = QueryAllBalancesRequest.create()

    request.address = address

    try {
      const response = await this.query.AllBalances(request)

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
    const request = QueryTotalSupplyRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.query.TotalSupply(request)

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
