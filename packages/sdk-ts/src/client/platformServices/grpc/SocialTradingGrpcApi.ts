import * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import { PositionsServiceClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcPositionsTransformer } from '../transformers/index.js'
import type {
  PlatformServicesListPositionsParams,
  PlatformServicesGetAccountCountParams,
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

  async fetchPositions(params?: PlatformServicesListPositionsParams) {
    const { to, from, accountAddress, pageSize, nextToken } = params || {}

    const request = PlatformServicesPositionsPb.ListPositionsRequest.create({
      to,
      from,
      pageSize,
      nextToken,
      accountAddress,
    })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListPositionsRequest,
      PlatformServicesPositionsPb.ListPositionsResponse
    >(request, this.client.listPositions.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcListPositionsToListPositions(
      response,
    )
  }

  async fetchPositionTrades(params: PlatformServicesListPositionTradesParams) {
    const { pageSize, nextToken, positionId } = params

    const request =
      PlatformServicesPositionsPb.ListPositionTradesRequest.create({
        pageSize,
        nextToken,
        positionId,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListPositionTradesRequest,
      PlatformServicesPositionsPb.ListPositionTradesResponse
    >(request, this.client.listPositionTrades.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcListPositionTradesToListPositionTrades(
      response,
    )
  }

  async fetchAccountPositionStats(
    params: PlatformServicesGetAccountPositionStatsParams,
  ) {
    const { accountAddress, window } = params

    const request =
      PlatformServicesPositionsPb.GetAccountPositionStatsRequest.create({
        window,
        accountAddress,
      })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.GetAccountPositionStatsRequest,
      PlatformServicesPositionsPb.GetAccountPositionStatsResponse
    >(request, this.client.getAccountPositionStats.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountPositionStatsToAccountPositionStats(
      response,
    )
  }

  async fetchAccountDailyPNL(params: PlatformServicesGetAccountDailyPNLParams) {
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
    >(request, this.client.getAccountDailyPNL.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountDailyPNLToGetAccountDailyPNL(
      response,
    )
  }

  async fetchAccountTags() {
    const request = PlatformServicesPositionsPb.ListAccountTagsRequest.create()

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.ListAccountTagsRequest,
      PlatformServicesPositionsPb.ListAccountTagsResponse
    >(request, this.client.listAccountTags.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcListAccountTagsToListAccountTags(
      response,
    )
  }

  async fetchAccountCount(params?: PlatformServicesGetAccountCountParams) {
    const { window } = params || {}

    const request = PlatformServicesPositionsPb.GetAccountCountRequest.create({
      window,
    })

    const response = await this.executeGrpcCall<
      PlatformServicesPositionsPb.GetAccountCountRequest,
      PlatformServicesPositionsPb.GetAccountCountResponse
    >(request, this.client.getAccountCount.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcGetAccountCountToGetAccountCount(
      response,
    )
  }

  async fetchAccountPositionStatsList(
    params?: PlatformServicesListAccountPositionStatsParams,
  ) {
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
    >(request, this.client.listAccountPositionStats.bind(this.client))

    return PlatformServicesGrpcPositionsTransformer.grpcListAccountPositionStatsToListAccountPositionStats(
      response,
    )
  }
}
