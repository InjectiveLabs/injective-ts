import { InjectiveErc20V1Beta1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { fetchAllWithPagination } from '../../../utils/pagination.js'
import {
  ChainGrpcErc20Transformer,
  ChainGrpcCommonTransformer,
} from '../transformers/index.js'
import type { PaginationOption } from '../../../types/pagination.js'

const MAX_LIMIT_FOR_SUPPLY = 10000

/**
 * @category Chain Grpc API
 */
export class ChainGrpcErc20Api extends BaseGrpcConsumer {
  protected module: string = ChainModule.Erc20

  protected client: InjectiveErc20V1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveErc20V1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request = InjectiveErc20V1Beta1Query.QueryParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveErc20V1Beta1Query.QueryParamsResponse>(() =>
          this.client.Params(request, this.metadata),
        )

      return ChainGrpcErc20Transformer.paramsResponseToParams(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveErc20V1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Erc20Params',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Erc20Params',
        contextModule: this.module,
      })
    }
  }

  async fetchTokenPairs(pagination?: PaginationOption) {
    const request =
      InjectiveErc20V1Beta1Query.QueryAllTokenPairsRequest.create()
    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequest(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    try {
      const response =
        await this.retry<InjectiveErc20V1Beta1Query.QueryAllTokenPairsResponse>(
          () => this.client.AllTokenPairs(request, this.metadata),
        )

      return ChainGrpcErc20Transformer.tokenPairsResponseToTokenPairs(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveErc20V1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Erc20TokenPairs',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Erc20TokenPairs',
        contextModule: this.module,
      })
    }
  }

  async fetchAllTokenPairsWithPagination(
    pagination: PaginationOption = { limit: MAX_LIMIT_FOR_SUPPLY },
  ) {
    return fetchAllWithPagination(pagination, this.fetchTokenPairs.bind(this))
  }

  async fetchTokenPairByDenom(denom: string) {
    const request =
      InjectiveErc20V1Beta1Query.QueryTokenPairByDenomRequest.create()
    request.bankDenom = denom

    try {
      const response =
        await this.retry<InjectiveErc20V1Beta1Query.QueryTokenPairByDenomResponse>(
          () => this.client.TokenPairByDenom(request, this.metadata),
        )

      if (!response.tokenPair) {
        return undefined
      }

      return ChainGrpcErc20Transformer.grpcTokenPairToTokenPair(
        response.tokenPair,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveErc20V1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Erc20TokenPairByDenom',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Erc20TokenPairByDenom',
        contextModule: this.module,
      })
    }
  }

  async fetchTokenPairByErc20Address(erc20Address: string) {
    const request =
      InjectiveErc20V1Beta1Query.QueryTokenPairByERC20AddressRequest.create()
    request.erc20Address = erc20Address

    try {
      const response =
        await this.retry<InjectiveErc20V1Beta1Query.QueryTokenPairByERC20AddressResponse>(
          () => this.client.TokenPairByERC20Address(request, this.metadata),
        )

      if (!response.tokenPair) {
        return undefined
      }

      return ChainGrpcErc20Transformer.grpcTokenPairToTokenPair(
        response.tokenPair,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveErc20V1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Erc20TokenPairByErc20Address',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Erc20TokenPairByErc20Address',
        contextModule: this.module,
      })
    }
  }
}
