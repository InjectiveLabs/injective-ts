import {
  QueryClientImpl,
  QueryAllBalancesRequest,
  QueryBalanceRequest,
  QueryTotalSupplyRequest,
  QueryParamsRequest as QueryBankParamsRequest,
} from '@injectivelabs/core-proto-ts/cosmos/bank/v1beta1/query'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcBankTransformer } from '../transformers'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi {
  protected module: string = ChainModule.Bank

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryBankParamsRequest.create()

    try {
      const response = await this.client.Params(request)

      return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.Balance(request)

      return ChainGrpcBankTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.AllBalances(request)

      return ChainGrpcBankTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.TotalSupply(request)

      return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
