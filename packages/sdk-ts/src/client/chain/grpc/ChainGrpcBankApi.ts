import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'
import { ChainGrpcBankTransformer } from '../transformers'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types'
import { CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi {
  protected module: string = ChainModule.Bank

  protected client: CosmosBankV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new CosmosBankV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosBankV1Beta1Query.QueryParamsRequest.create()

    try {
      const response = await this.client.Params(request)

      return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Params',
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
    const request = CosmosBankV1Beta1Query.QueryBalanceRequest.create()

    request.address = accountAddress
    request.denom = denom

    try {
      const response = await this.client.Balance(request)

      return ChainGrpcBankTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Balance',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Balance',
        contextModule: this.module,
      })
    }
  }

  async fetchBalances(address: string) {
    const request = CosmosBankV1Beta1Query.QueryAllBalancesRequest.create()

    request.address = address

    try {
      const response = await this.client.AllBalances(request)

      return ChainGrpcBankTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AllBalances',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AllBalances',
        contextModule: this.module,
      })
    }
  }

  async fetchTotalSupply(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryTotalSupplyRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response = await this.client.TotalSupply(request)

      return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TotalSupply',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TotalSupply',
        contextModule: this.module,
      })
    }
  }
}
