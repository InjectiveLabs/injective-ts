import * as PlatformServicesChartsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_charts_trading_view_service_pb'
import { ChartsTradingViewServiceClient } from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_charts_trading_view_service_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { PlatformServicesGrpcChartsTransformer } from '../transformers/index.js'
import type {
  PlatformServicesMarketHistoryParams,
  PlatformServicesSpotMarketHistoryParams,
  PlatformServicesSpotMarketSummaryParams,
  PlatformServicesAllSpotMarketSummariesParams,
} from '../types/index.js'

export class ChartsTradingViewGrpcApi extends BaseGrpcConsumer {
  protected module: string = 'platform-services'

  private get client() {
    return this.initClient(ChartsTradingViewServiceClient)
  }

  async fetchDerivativeMarketHistory(
    params: PlatformServicesMarketHistoryParams,
  ) {
    const request =
      PlatformServicesChartsPb.DerivativeMarketHistoryRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesChartsPb.DerivativeMarketHistoryRequest,
      PlatformServicesChartsPb.DerivativeMarketHistoryResponse
    >(request, this.client.derivativeMarketHistory.bind(this.client))

    return PlatformServicesGrpcChartsTransformer.grpcMarketHistoryToMarketHistory(
      response,
    )
  }

  async fetchSpotMarketHistory(
    params: PlatformServicesSpotMarketHistoryParams,
  ) {
    const request =
      PlatformServicesChartsPb.SpotMarketHistoryRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesChartsPb.SpotMarketHistoryRequest,
      PlatformServicesChartsPb.SpotMarketHistoryResponse
    >(request, this.client.spotMarketHistory.bind(this.client))

    return PlatformServicesGrpcChartsTransformer.grpcMarketHistoryToMarketHistory(
      response,
    )
  }

  async fetchSpotMarketSummary(
    params: PlatformServicesSpotMarketSummaryParams,
  ) {
    const request =
      PlatformServicesChartsPb.SpotMarketSummaryRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesChartsPb.SpotMarketSummaryRequest,
      PlatformServicesChartsPb.SpotMarketSummaryResponse
    >(request, this.client.spotMarketSummary.bind(this.client))

    return PlatformServicesGrpcChartsTransformer.grpcMarketSummaryToMarketSummary(
      response,
    )
  }

  async fetchAllSpotMarketSummaries(
    params?: PlatformServicesAllSpotMarketSummariesParams,
  ) {
    const request =
      PlatformServicesChartsPb.AllSpotMarketSummaryRequest.create(params)
    const response = await this.executeGrpcCall<
      PlatformServicesChartsPb.AllSpotMarketSummaryRequest,
      PlatformServicesChartsPb.AllSpotMarketSummaryResponse
    >(request, this.client.allSpotMarketSummary.bind(this.client))

    return response.field.map(
      PlatformServicesGrpcChartsTransformer.grpcMarketSummaryToMarketSummary,
    )
  }
}
