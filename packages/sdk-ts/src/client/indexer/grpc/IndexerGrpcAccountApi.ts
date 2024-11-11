import {
  GeneralException,
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { IndexerGrpcAccountTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAccountRpc.InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveAccountRpc.InjectiveAccountsRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  /**
   * @deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio instead
   */
  async fetchPortfolio(_address: string) {
    throw new GeneralException(
      new Error(
        'deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio',
      ),
    )
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = InjectiveAccountRpc.RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = epoch.toString()
    }

    try {
      const response = await this.retry<InjectiveAccountRpc.RewardsResponse>(
        () => this.client.Rewards(request),
      )

      return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Rewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Rewards',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountsList(address: string) {
    const request = InjectiveAccountRpc.SubaccountsListRequest.create()

    request.accountAddress = address

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountsListResponse>(() =>
          this.client.SubaccountsList(request),
        )

      return response.subaccounts
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountsList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountsList',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountBalance(subaccountId: string, denom: string) {
    const request =
      InjectiveAccountRpc.SubaccountBalanceEndpointRequest.create()

    request.subaccountId = subaccountId
    request.denom = denom

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountBalanceEndpointResponse>(
          () => this.client.SubaccountBalanceEndpoint(request),
        )

      return IndexerGrpcAccountTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountBalanceEndpoint',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountBalanceEndpoint',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountBalancesList(subaccountId: string) {
    const request = InjectiveAccountRpc.SubaccountBalancesListRequest.create()

    request.subaccountId = subaccountId

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountBalancesListResponse>(
          () => this.client.SubaccountBalancesList(request),
        )

      return IndexerGrpcAccountTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountBalancesList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountBalancesList',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountHistory({
    subaccountId,
    denom,
    transferTypes = [],
    pagination,
  }: {
    subaccountId: string
    denom?: string
    transferTypes?: string[]
    pagination?: PaginationOption
  }) {
    const request = InjectiveAccountRpc.SubaccountHistoryRequest.create()

    request.subaccountId = subaccountId

    if (denom) {
      request.denom = denom
    }

    if (transferTypes.length > 0) {
      request.transferTypes = transferTypes
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = pagination.endTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountHistoryResponse>(() =>
          this.client.SubaccountHistory(request),
        )

      return IndexerGrpcAccountTransformer.transferHistoryResponseToTransferHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountHistory',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountOrderSummary({
    subaccountId,
    marketId,
    orderDirection,
  }: {
    subaccountId: string
    marketId?: string
    orderDirection?: string
  }) {
    const request = InjectiveAccountRpc.SubaccountOrderSummaryRequest.create()

    request.subaccountId = subaccountId

    if (marketId) {
      request.marketId = marketId
    }

    if (orderDirection) {
      request.orderDirection = orderDirection
    }

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountOrderSummaryResponse>(
          () => this.client.SubaccountOrderSummary(request),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountOrderSummary',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountOrderSummary',
        contextModule: this.module,
      })
    }
  }

  async fetchOrderStates(params?: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const { spotOrderHashes = [], derivativeOrderHashes = [] } = params || {}
    const request = InjectiveAccountRpc.OrderStatesRequest.create()

    request.spotOrderHashes = spotOrderHashes
    request.derivativeOrderHashes = derivativeOrderHashes

    try {
      const response =
        await this.retry<InjectiveAccountRpc.OrderStatesResponse>(() =>
          this.client.OrderStates(request),
        )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OrderStates',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'OrderStates',
        contextModule: this.module,
      })
    }
  }
}
