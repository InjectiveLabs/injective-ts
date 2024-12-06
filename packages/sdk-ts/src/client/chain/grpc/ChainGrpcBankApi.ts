import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { ChainGrpcBankTransformer } from '../transformers/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import {
  fetchAllWithPagination,
  paginationRequestFromPagination,
} from '../../../utils/pagination.js'

const MAX_LIMIT_FOR_SUPPLY = 10000

/**
 * @category Chain Grpc API
 */
export class ChainGrpcBankApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Bank

  protected client: CosmosBankV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosBankV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = CosmosBankV1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcBankTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryBalanceResponse>(() =>
          this.client.Balance(request, this.metadata),
        )

      return ChainGrpcBankTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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

  async fetchBalances(address: string, pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryAllBalancesRequest.create()

    request.address = address

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryAllBalancesResponse>(() =>
          this.client.AllBalances(request, this.metadata),
        )

      return ChainGrpcBankTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryTotalSupplyResponse>(() =>
          this.client.TotalSupply(request, this.metadata),
        )

      return ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply(response)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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

  /** a way to ensure all total supply is fully fetched */
  async fetchAllTotalSupply(
    pagination: PaginationOption = { limit: MAX_LIMIT_FOR_SUPPLY },
  ) {
    return fetchAllWithPagination(pagination, this.fetchTotalSupply.bind(this))
  }

  async fetchSupplyOf(denom: string) {
    const request = CosmosBankV1Beta1Query.QuerySupplyOfRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QuerySupplyOfResponse>(() =>
          this.client.SupplyOf(request, this.metadata),
        )

      return ChainGrpcBankTransformer.grpcCoinToCoin(response.amount!)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'fetchSupplyOf',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'fetchSupplyOf',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomsMetadata(pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryDenomsMetadataRequest.create()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryDenomsMetadataResponse>(
          () => this.client.DenomsMetadata(request, this.metadata),
        )

      return ChainGrpcBankTransformer.denomsMetadataResponseToDenomsMetadata(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'DenomsMetadata',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomsMetadata',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomMetadata(denom: string) {
    const request = CosmosBankV1Beta1Query.QueryDenomMetadataRequest.create()

    request.denom = denom

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryDenomMetadataResponse>(
          () => this.client.DenomMetadata(request, this.metadata),
        )

      return ChainGrpcBankTransformer.metadataToMetadata(response.metadata!)
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'DenomMetadata',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomMetadata',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomOwners(denom: string, pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1Query.QueryDenomOwnersRequest.create()

    request.denom = denom

    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<CosmosBankV1Beta1Query.QueryDenomOwnersResponse>(() =>
          this.client.DenomOwners(request, this.metadata),
        )

      return ChainGrpcBankTransformer.denomOwnersResponseToDenomOwners(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof CosmosBankV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'DenomOwners',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomOwners',
        contextModule: this.module,
      })
    }
  }
}
