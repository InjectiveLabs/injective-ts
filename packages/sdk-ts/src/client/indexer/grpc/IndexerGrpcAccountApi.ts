import {
  InjectiveAccountsRPCClientImpl,
  OrderStatesRequest,
  PortfolioRequest,
  RewardsRequest,
  SubaccountBalanceRequest,
  SubaccountBalancesListRequest,
  SubaccountHistoryRequest,
  SubaccountOrderSummaryRequest,
  SubaccountsListRequest,
} from '@injectivelabs/indexer-proto-ts/injective_accounts_rpc'
import { PaginationOption } from '../../../types/pagination'
import { IndexerGrpcAccountTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/indexer-proto-ts/injective_explorer_rpc'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountApi {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAccountsRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchPortfolio(address: string) {
    const request = PortfolioRequest.create()

    request.accountAddress = address

    try {
      const response = await this.client.Portfolio(request)

      return IndexerGrpcAccountTransformer.accountPortfolioResponseToAccountPortfolio(
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

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = epoch.toString()
    }

    try {
      const response = await this.client.Rewards(request)

      return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
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

  async fetchSubaccountsList(address: string) {
    const request = SubaccountsListRequest.create()

    request.accountAddress = address

    try {
      const response = await this.client.SubaccountsList(request)

      return response.subaccounts
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

  async fetchSubaccountBalance(subaccountId: string, denom: string) {
    const request = SubaccountBalanceRequest.create()

    request.subaccountId = subaccountId
    request.denom = denom

    try {
      const response = await this.client.SubaccountBalanceEndpoint(request)

      return IndexerGrpcAccountTransformer.balanceResponseToBalance(response)
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

  async fetchSubaccountBalancesList(subaccountId: string) {
    const request = SubaccountBalancesListRequest.create()

    request.subaccountId = subaccountId

    try {
      const response = await this.client.SubaccountBalancesList(request)

      return IndexerGrpcAccountTransformer.balancesResponseToBalances(response)
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
    const request = SubaccountHistoryRequest.create()

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
      const response = await this.client.SubaccountHistory(request)

      return IndexerGrpcAccountTransformer.transferHistoryResponseToTransferHistory(
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

  async fetchSubaccountOrderSummary({
    subaccountId,
    marketId,
    orderDirection,
  }: {
    subaccountId: string
    marketId?: string
    orderDirection?: string
  }) {
    const request = SubaccountOrderSummaryRequest.create()

    request.subaccountId = subaccountId

    if (marketId) {
      request.marketId = marketId
    }

    if (orderDirection) {
      request.orderDirection = orderDirection
    }

    try {
      const response = await this.client.SubaccountOrderSummary(request)

      return response
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

  async fetchOrderStates(params?: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const { spotOrderHashes = [], derivativeOrderHashes = [] } = params || {}
    const request = OrderStatesRequest.create()

    request.spotOrderHashes = spotOrderHashes
    request.derivativeOrderHashes = derivativeOrderHashes

    try {
      const response = await this.client.OrderStates(request)

      return response
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
