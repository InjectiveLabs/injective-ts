import { throwIfAborted } from '@injectivelabs/utils'
import * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import { PositionsServiceClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcPositionsTransformer } from '../transformers/index.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  PlatformServicesListPositionsParams,
  PlatformServicesGetAccountCountParams,
  PlatformServicesListAccountTradesParams,
  PlatformServicesListPositionTradesParams,
  PlatformServicesGetAccountDailyPNLParams,
  PlatformServicesGetAccountPositionStatsParams,
  PlatformServicesListAccountPositionStatsParams,
} from '../types/index.js'

export class SocialTradingGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(PositionsServiceClient)
  }

  async fetchPositions(
    params?: PlatformServicesListPositionsParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { id, to, from, txHash, accountAddress, pageSize, nextToken } =
      params || {}

    const request = PlatformServicesPositionsPb.ListPositionsRequest.create({
      id,
      to,
      from,
      txHash,
      pageSize,
      nextToken,
      accountAddress,
    })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListPositionsRequest,
      PlatformServicesPositionsPb.ListPositionsResponse
    >(request, this.client.listPositions.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcListPositionsToListPositions(
      response,
    )
  }

  async fetchPositionTrades(
    params: PlatformServicesListPositionTradesParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { pageSize, nextToken, positionId, sortDirection } = params

    const request =
      PlatformServicesPositionsPb.ListPositionTradesRequest.create({
        pageSize,
        nextToken,
        positionId,
        sortDirection,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListPositionTradesRequest,
      PlatformServicesPositionsPb.ListPositionTradesResponse
    >(request, this.client.listPositionTrades.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcListPositionTradesToListPositionTrades(
      response,
    )
  }

  /**
   * A page can hold fewer trades than pageSize, or none, while nextToken is
   * set; keep paging until nextToken is empty.
   */
  async fetchAccountTrades(params: PlatformServicesListAccountTradesParams) {
    const { marketId, pageSize, nextToken, sortDirection, accountAddress } =
      params

    const request = PlatformServicesPositionsPb.ListAccountTradesRequest.create(
      {
        marketId,
        pageSize,
        nextToken,
        sortDirection,
        accountAddress,
      },
    )

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListAccountTradesRequest,
      PlatformServicesPositionsPb.ListAccountTradesResponse
    >(request, this.client.listAccountTrades.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcListAccountTradesToListAccountTrades(
      response,
    )
  }

  async fetchAccountPositionStats(
    params: PlatformServicesGetAccountPositionStatsParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { accountAddress, window } = params

    const request =
      PlatformServicesPositionsPb.GetAccountPositionStatsRequest.create({
        window,
        accountAddress,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.GetAccountPositionStatsRequest,
      PlatformServicesPositionsPb.GetAccountPositionStatsResponse
    >(request, this.client.getAccountPositionStats.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountPositionStatsToAccountPositionStats(
      response,
    )
  }

  async fetchAccountDailyPNL(
    params: PlatformServicesGetAccountDailyPNLParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { accountAddress, from, to } = params

    const request =
      PlatformServicesPositionsPb.GetAccountDailyPNLRequest.create({
        to,
        from,
        accountAddress,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.GetAccountDailyPNLRequest,
      PlatformServicesPositionsPb.GetAccountDailyPNLResponse
    >(request, this.client.getAccountDailyPNL.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountDailyPNLToGetAccountDailyPNL(
      response,
    )
  }

  async fetchAccountTags(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request = PlatformServicesPositionsPb.ListAccountTagsRequest.create()

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListAccountTagsRequest,
      PlatformServicesPositionsPb.ListAccountTagsResponse
    >(request, this.client.listAccountTags.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcListAccountTagsToListAccountTags(
      response,
    )
  }

  async fetchAccountCount(
    params?: PlatformServicesGetAccountCountParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const { window } = params || {}

    const request = PlatformServicesPositionsPb.GetAccountCountRequest.create({
      window,
    })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.GetAccountCountRequest,
      PlatformServicesPositionsPb.GetAccountCountResponse
    >(request, this.client.getAccountCount.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountCountToGetAccountCount(
      response,
    )
  }

  async fetchAccountPositionStatsList(
    params?: PlatformServicesListAccountPositionStatsParams,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const {
      to,
      from,
      tag,
      window,
      sortBy,
      pageSize,
      nextToken,
      sortDirection,
      accountAddress = [],
    } = params || {}

    const request =
      PlatformServicesPositionsPb.ListAccountPositionStatsRequest.create({
        to,
        from,
        tag,
        window,
        sortBy,
        pageSize,
        nextToken,
        accountAddress,
        sortDirection,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListAccountPositionStatsRequest,
      PlatformServicesPositionsPb.ListAccountPositionStatsResponse
    >(request, this.client.listAccountPositionStats.bind(this.client), options)

    return PlatformServicesGrpcPositionsTransformer.grpcListAccountPositionStatsToListAccountPositionStats(
      response,
    )
  }
}
