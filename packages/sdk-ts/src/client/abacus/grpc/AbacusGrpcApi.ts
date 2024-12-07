import {
  IndexerErrorModule,
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveAbacusRpc } from '@injectivelabs/abacus-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { AbacusGrpcTransformer } from './transformers/index.js'

export class AbacusGrpcApi extends BaseGrpcConsumer {
  protected module: string = IndexerErrorModule.Abacus

  protected client: InjectiveAbacusRpc.PointsSvcClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveAbacusRpc.PointsSvcClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchAccountLatestPoints(address: string) {
    const request = InjectiveAbacusRpc.PointsLatestForAccountRequest.create()

    request.accountAddress = address

    try {
      const response =
        await this.retry<InjectiveAbacusRpc.PointsLatestForAccountResponse>(
          () => this.client.PointsLatestForAccount(request),
        )

      return AbacusGrpcTransformer.grpcPointsLatestToPointsLatest(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAbacusRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PointsStatsLatestForAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PointsStatsLatestForAccount',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountDailyPoints(address: string, daysLimit?: number) {
    const request =
      InjectiveAbacusRpc.PointsStatsDailyForAccountRequest.create()

    request.accountAddress = address

    if (daysLimit) {
      request.daysLimit = daysLimit
    }

    try {
      const response =
        await this.retry<InjectiveAbacusRpc.PointsStatsDailyForAccountResponse>(
          () => this.client.PointsStatsDailyForAccount(request),
        )

      return AbacusGrpcTransformer.grpcPointsStatsDailyToPointsStatsDaily(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAbacusRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PointsStatsDailyForAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PointsStatsDailyForAccount',
        contextModule: this.module,
      })
    }
  }

  async fetchAccountWeeklyPoints(address: string, weeksLimit?: number) {
    const request =
      InjectiveAbacusRpc.PointsStatsWeeklyForAccountRequest.create()

    request.accountAddress = address

    if (weeksLimit) {
      request.weeksLimit = weeksLimit
    }

    try {
      const response =
        await this.retry<InjectiveAbacusRpc.PointsStatsWeeklyForAccountResponse>(
          () => this.client.PointsStatsWeeklyForAccount(request),
        )

      return AbacusGrpcTransformer.grpcPointsStatsWeeklyToPointsStatsWeekly(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAbacusRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PointsStatsWeeklyForAccount',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PointsStatsWeeklyForAccount',
        contextModule: this.module,
      })
    }
  }
}
