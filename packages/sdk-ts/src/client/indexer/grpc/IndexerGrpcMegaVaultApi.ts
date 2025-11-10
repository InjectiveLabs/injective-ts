import {
  InjectiveMegavaultRpcPb,
  InjectiveMegavaultRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcMegaVaultTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumerV2 from '../../base/BaseIndexerGrpcConsumerV2.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMegaVaultApi extends BaseIndexerGrpcConsumerV2 {
  protected module: string = IndexerModule.MegaVault
  private client: InjectiveMegavaultRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveMegavaultRPCClient(this.transport)
  }

  async fetchVault({ vaultAddress }: { vaultAddress: string }) {
    const request = InjectiveMegavaultRpcPb.GetVaultRequest.create()

    request.vaultAddress = vaultAddress

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.GetVaultRequest,
      InjectiveMegavaultRpcPb.GetVaultResponse
    >(request, this.client.getVault.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.vaultResponseToVault(response)
  }

  async fetchVaultUser({
    vaultAddress,
    userAddress,
  }: {
    userAddress: string
    vaultAddress: string
  }) {
    const request = InjectiveMegavaultRpcPb.GetUserRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.GetUserRequest,
      InjectiveMegavaultRpcPb.GetUserResponse
    >(request, this.client.getUser.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.userResponseToUser(response)
  }

  async fetchVaultSubscriptions({
    token,
    status,
    perPage,
    userAddress,
    vaultAddress,
  }: {
    token?: string
    status?: string
    perPage?: number
    userAddress: string
    vaultAddress: string
  }) {
    const request = InjectiveMegavaultRpcPb.ListSubscriptionsRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    if (status) {
      request.status = status
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.ListSubscriptionsRequest,
      InjectiveMegavaultRpcPb.ListSubscriptionsResponse
    >(request, this.client.listSubscriptions.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.subscriptionsResponseToSubscriptions(
      response,
    )
  }

  async fetchVaultRedemptions({
    token,
    status,
    perPage,
    userAddress,
    vaultAddress,
  }: {
    token?: string
    status?: string
    perPage?: number
    vaultAddress: string
    userAddress: string
  }) {
    const request = InjectiveMegavaultRpcPb.ListRedemptionsRequest.create()

    request.vaultAddress = vaultAddress
    request.userAddress = userAddress

    if (status) {
      request.status = status
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.ListRedemptionsRequest,
      InjectiveMegavaultRpcPb.ListRedemptionsResponse
    >(request, this.client.listRedemptions.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.redemptionsResponseToRedemptions(
      response,
    )
  }

  async fetchOperatorRedemptionBuckets({
    vaultAddress,
    operatorAddress,
  }: {
    vaultAddress: string
    operatorAddress: string
  }) {
    const request =
      InjectiveMegavaultRpcPb.GetOperatorRedemptionBucketsRequest.create()

    request.vaultAddress = vaultAddress
    request.operatorAddress = operatorAddress

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.GetOperatorRedemptionBucketsRequest,
      InjectiveMegavaultRpcPb.GetOperatorRedemptionBucketsResponse
    >(request, this.client.getOperatorRedemptionBuckets.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.operatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
      response,
    )
  }

  async fetchVaultTvlHistory({
    since,
    vaultAddress,
    maxDataPoints,
  }: {
    since: number
    vaultAddress: string
    maxDataPoints?: number
  }) {
    const request = InjectiveMegavaultRpcPb.TvlHistoryRequest.create()

    request.vaultAddress = vaultAddress
    request.since = BigInt(since)

    if (maxDataPoints) {
      request.maxDataPoints = maxDataPoints
    }

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.TvlHistoryRequest,
      InjectiveMegavaultRpcPb.TvlHistoryResponse
    >(request, this.client.tvlHistory.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.tvlHistoryResponseToTvlHistory(
      response,
    )
  }

  async fetchVaultPnlHistory({
    since,
    vaultAddress,
    maxDataPoints,
  }: {
    since: number
    vaultAddress: string
    maxDataPoints?: number
  }) {
    const request = InjectiveMegavaultRpcPb.PnlHistoryRequest.create()

    request.vaultAddress = vaultAddress
    request.since = BigInt(since)

    if (maxDataPoints) {
      request.maxDataPoints = maxDataPoints
    }

    const response = await this.executeGrpcCall<
      InjectiveMegavaultRpcPb.PnlHistoryRequest,
      InjectiveMegavaultRpcPb.PnlHistoryResponse
    >(request, this.client.pnlHistory.bind(this.client))

    return IndexerGrpcMegaVaultTransformer.pnlHistoryResponseToPnlHistory(
      response,
    )
  }
}
