import { throwIfAborted } from '@injectivelabs/utils'
import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as PointsSvcPb from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb'
import { PointsSvcClient } from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb.client'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { AbacusGrpcTransformer } from './transformers/index.js'
import type { RequestOptions } from '@injectivelabs/utils'

export class AbacusGrpcApi extends BaseGrpcConsumer {
  protected module: string = IndexerErrorModule.Abacus

  private get client() {
    return this.initClient(PointsSvcClient)
  }

  async fetchAccountLatestPoints(address: string, options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request = PointsSvcPb.PointsLatestForAccountRequest.create({
      accountAddress: address,
    })

    const response = await this.executeGrpcCall<
      PointsSvcPb.PointsLatestForAccountRequest,
      PointsSvcPb.PointsLatestForAccountResponse
    >(request, this.client.pointsLatestForAccount.bind(this.client), options)

    return AbacusGrpcTransformer.grpcPointsLatestToPointsLatest(response)
  }

  async fetchAccountDailyPoints(
    address: string,
    daysLimit?: number,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = PointsSvcPb.PointsStatsDailyForAccountRequest.create({
      accountAddress: address,
      daysLimit: daysLimit ? BigInt(daysLimit) : undefined,
    })

    const response = await this.executeGrpcCall<
      PointsSvcPb.PointsStatsDailyForAccountRequest,
      PointsSvcPb.HistoricalPointsStatsRowCollection
    >(
      request,
      this.client.pointsStatsDailyForAccount.bind(this.client),
      options,
    )

    return AbacusGrpcTransformer.grpcPointsStatsDailyToPointsStatsDaily(
      response,
    )
  }

  async fetchAccountWeeklyPoints(
    address: string,
    weeksLimit?: number,
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = PointsSvcPb.PointsStatsWeeklyForAccountRequest.create({
      accountAddress: address,
      weeksLimit: weeksLimit ? BigInt(weeksLimit) : undefined,
    })

    const response = await this.executeGrpcCall<
      PointsSvcPb.PointsStatsWeeklyForAccountRequest,
      PointsSvcPb.HistoricalPointsStatsRowCollection
    >(
      request,
      this.client.pointsStatsWeeklyForAccount.bind(this.client),
      options,
    )

    return AbacusGrpcTransformer.grpcPointsStatsWeeklyToPointsStatsWeekly(
      response,
    )
  }
}
