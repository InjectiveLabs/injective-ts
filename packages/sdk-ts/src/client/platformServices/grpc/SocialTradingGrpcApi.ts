import * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import { PositionsServiceClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcPositionsTransformer } from '../transformers/index'
import type {
  PlatformServicesListPositionsParams,
  PlatformServicesGetAccountDailyPNLParams,
  PlatformServicesGetAccountPositionStatsParams,
  PlatformServicesListAccountPositionStatsParams,
} from '../types/index'

export class SocialTradingGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(PositionsServiceClient)
  }

  async fetchPositions(params?: PlatformServicesListPositionsParams) {
    const { accountAddress, pageSize, nextToken } = params || {}

    const request = PlatformServicesPositionsPb.ListPositionsRequest.create({
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

  async fetchAccountPositionStatsList(
    params?: PlatformServicesListAccountPositionStatsParams,
  ) {
    const {
      window,
      sortBy,
      pageSize,
      nextToken,
      sortDirection,
      accountAddress = [],
    } = params || {}

    const request =
      PlatformServicesPositionsPb.ListAccountPositionStatsRequest.create({
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
