import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcArchiverTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcArchiverApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Archiver

  protected client: InjectiveArchiverRpc.InjectiveArchiverRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveArchiverRpc.InjectiveArchiverRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchHistoricalBalance({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpc.BalanceRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRpc.BalanceResponse>(
        () => this.client.Balance(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceResponseToHistoricalBalances(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Balance',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Balance',
        contextModule: this.module,
      })
    }
  }

  async fetchHistoricalRpnl({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpc.RpnlRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRpc.RpnlResponse>(() =>
        this.client.Rpnl(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLResponseToHistoricalRPNL(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Rpnl',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Rpnl',
        contextModule: this.module,
      })
    }
  }

  async fetchHistoricalVolumes({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpc.VolumesRequest.create()

    request.account = account
    request.resolution = resolution

    try {
      const response = await this.retry<InjectiveArchiverRpc.VolumesResponse>(
        () => this.client.Volumes(request),
      )

      return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesResponseToHistoricalVolumes(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Historical Volumes',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Historical Volumes',
        contextModule: this.module,
      })
    }
  }

  async fetchPnlLeaderboard({
    startDate,
    endDate,
    limit,
    account,
  }: {
    startDate: string
    endDate: string
    limit?: number
    account?: string
  }) {
    const request = InjectiveArchiverRpc.PnlLeaderboardRequest.create()

    request.startDate = startDate
    request.endDate = endDate

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    try {
      const response =
        await this.retry<InjectiveArchiverRpc.PnlLeaderboardResponse>(() =>
          this.client.PnlLeaderboard(request),
        )

      return IndexerGrpcArchiverTransformer.grpcPnlLeaderboardResponseToPnlLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Pnl Leaderboard',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Pnl Leaderboard',
        contextModule: this.module,
      })
    }
  }

  async fetchVolLeaderboard({
    startDate,
    endDate,
    limit,
    account,
  }: {
    startDate: string
    endDate: string
    limit?: number
    account?: string
  }) {
    const request = InjectiveArchiverRpc.VolLeaderboardRequest.create()

    request.startDate = startDate
    request.endDate = endDate

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    try {
      const response =
        await this.retry<InjectiveArchiverRpc.VolLeaderboardResponse>(() =>
          this.client.VolLeaderboard(request),
        )

      return IndexerGrpcArchiverTransformer.grpcVolLeaderboardResponseToVolLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Vol Leaderboard',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Vol Leaderboard',
        contextModule: this.module,
      })
    }
  }

  async fetchPnlLeaderboardFixedResolution({
    resolution,
    limit,
    account,
  }: {
    resolution: string
    limit?: number
    account?: string
  }) {
    const request =
      InjectiveArchiverRpc.PnlLeaderboardFixedResolutionRequest.create()

    request.resolution = resolution

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    try {
      const response =
        await this.retry<InjectiveArchiverRpc.PnlLeaderboardFixedResolutionResponse>(
          () => this.client.PnlLeaderboardFixedResolution(request),
        )

      return IndexerGrpcArchiverTransformer.grpcPnlLeaderboardFixedResolutionResponseToPnlLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Pnl Leaderboard Fixed Resolution',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Pnl Leaderboard Fixed Resolution',
        contextModule: this.module,
      })
    }
  }

  async fetchVolLeaderboardFixedResolution({
    resolution,
    limit,
    account,
  }: {
    resolution: string
    limit?: number
    account?: string
  }) {
    const request =
      InjectiveArchiverRpc.VolLeaderboardFixedResolutionRequest.create()

    request.resolution = resolution

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    try {
      const response =
        await this.retry<InjectiveArchiverRpc.VolLeaderboardFixedResolutionResponse>(
          () => this.client.VolLeaderboardFixedResolution(request),
        )

      return IndexerGrpcArchiverTransformer.grpcVolLeaderboardFixedResolutionResponseToVolLeaderboard(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Vol Leaderboard Fixed Resolution',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Vol Leaderboard Fixed Resolution',
        contextModule: this.module,
      })
    }
  }

  async fetchDenomHolders({
    denom,
    token,
    limit,
  }: {
    denom: string
    token?: string
    limit?: number
  }) {
    const request = InjectiveArchiverRpc.DenomHoldersRequest.create()

    request.denom = denom

    if (token) {
      request.token = token
    }

    if (limit) {
      request.limit = limit
    }

    try {
      const response =
        await this.retry<InjectiveArchiverRpc.DenomHoldersResponse>(() =>
          this.client.DenomHolders(request),
        )

      return IndexerGrpcArchiverTransformer.grpcDenomHoldersResponseToDenomHolders(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveArchiverRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'DenomHolders',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'DenomHolders',
        contextModule: this.module,
      })
    }
  }
}
