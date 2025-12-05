import * as InjectiveArchiverRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcArchiverTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcArchiverApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Archiver
  private client: InjectiveArchiverRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveArchiverRPCClient(this.transport)
  }

  async fetchHistoricalBalance({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpcPb.BalanceRequest.create()

    request.account = account
    request.resolution = resolution

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.BalanceRequest,
      InjectiveArchiverRpcPb.BalanceResponse
    >(request, this.client.balance.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceResponseToHistoricalBalances(
      response,
    )
  }

  async fetchHistoricalRpnl({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpcPb.RpnlRequest.create()

    request.account = account
    request.resolution = resolution

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.RpnlRequest,
      InjectiveArchiverRpcPb.RpnlResponse
    >(request, this.client.rpnl.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLResponseToHistoricalRPNL(
      response,
    )
  }

  async fetchHistoricalVolumes({
    account,
    resolution,
  }: {
    account: string
    resolution: string
  }) {
    const request = InjectiveArchiverRpcPb.VolumesRequest.create()

    request.account = account
    request.resolution = resolution

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.VolumesRequest,
      InjectiveArchiverRpcPb.VolumesResponse
    >(request, this.client.volumes.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesResponseToHistoricalVolumes(
      response,
    )
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
    const request = InjectiveArchiverRpcPb.PnlLeaderboardRequest.create()

    request.startDate = BigInt(startDate)
    request.endDate = BigInt(endDate)

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.PnlLeaderboardRequest,
      InjectiveArchiverRpcPb.PnlLeaderboardResponse
    >(request, this.client.pnlLeaderboard.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcPnlLeaderboardResponseToPnlLeaderboard(
      response,
    )
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
    const request = InjectiveArchiverRpcPb.VolLeaderboardRequest.create()

    request.startDate = BigInt(startDate)
    request.endDate = BigInt(endDate)

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.VolLeaderboardRequest,
      InjectiveArchiverRpcPb.VolLeaderboardResponse
    >(request, this.client.volLeaderboard.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcVolLeaderboardResponseToVolLeaderboard(
      response,
    )
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
      InjectiveArchiverRpcPb.PnlLeaderboardFixedResolutionRequest.create()

    request.resolution = resolution

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.PnlLeaderboardFixedResolutionRequest,
      InjectiveArchiverRpcPb.PnlLeaderboardFixedResolutionResponse
    >(request, this.client.pnlLeaderboardFixedResolution.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcPnlLeaderboardFixedResolutionResponseToPnlLeaderboard(
      response,
    )
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
      InjectiveArchiverRpcPb.VolLeaderboardFixedResolutionRequest.create()

    request.resolution = resolution

    if (limit) {
      request.limit = limit
    }

    if (account) {
      request.account = account
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.VolLeaderboardFixedResolutionRequest,
      InjectiveArchiverRpcPb.VolLeaderboardFixedResolutionResponse
    >(request, this.client.volLeaderboardFixedResolution.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcVolLeaderboardFixedResolutionResponseToVolLeaderboard(
      response,
    )
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
    const request = InjectiveArchiverRpcPb.DenomHoldersRequest.create()

    request.denom = denom

    if (token) {
      request.token = token
    }

    if (limit) {
      request.limit = limit
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.DenomHoldersRequest,
      InjectiveArchiverRpcPb.DenomHoldersResponse
    >(request, this.client.denomHolders.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcDenomHoldersResponseToDenomHolders(
      response,
    )
  }

  async fetchAccountStats({
    account,
    period,
  }: {
    account: string
    period?: string
  }) {
    const request = InjectiveArchiverRpcPb.AccountStatsRequest.create()

    request.account = account

    if (period) {
      request.period = period
    }

    const response = await this.executeGrpcCall<
      InjectiveArchiverRpcPb.AccountStatsRequest,
      InjectiveArchiverRpcPb.AccountStatsResponse
    >(request, this.client.accountStats.bind(this.client))

    return IndexerGrpcArchiverTransformer.grpcAccountStatsResponseToAccountStats(
      response,
    )
  }
}
