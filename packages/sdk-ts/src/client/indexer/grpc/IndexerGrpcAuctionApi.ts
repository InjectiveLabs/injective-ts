import * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import { InjectiveAuctionRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcAuctionTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Auction

  private get client() {
    return this.initClient(InjectiveAuctionRPCClient)
  }

  async fetchAuction(round?: number) {
    const request = InjectiveAuctionRpcPb.AuctionEndpointRequest.create()

    /**
     * If round is provided, set it on the request,
     * otherwise fetch latest round
     **/
    if (round) {
      request.round = BigInt(round)
    }

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AuctionEndpointRequest,
      InjectiveAuctionRpcPb.AuctionEndpointResponse
    >(request, this.client.auctionEndpoint.bind(this.client))

    return IndexerGrpcAuctionTransformer.auctionResponseToAuction(response)
  }

  async fetchAuctions() {
    const request = InjectiveAuctionRpcPb.AuctionsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AuctionsRequest,
      InjectiveAuctionRpcPb.AuctionsResponse
    >(request, this.client.auctions.bind(this.client))

    return IndexerGrpcAuctionTransformer.auctionsResponseToAuctions(response)
  }

  async fetchInjBurnt() {
    const request = InjectiveAuctionRpcPb.InjBurntEndpointRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.InjBurntEndpointRequest,
      InjectiveAuctionRpcPb.InjBurntEndpointResponse
    >(request, this.client.injBurntEndpoint.bind(this.client))

    return Number(response.totalInjBurnt)
  }

  async fetchAuctionsHistoryV2({
    token,
    endTime,
    perPage = 5,
  }: {
    token?: string
    endTime?: string
    perPage?: number
  }) {
    const request = InjectiveAuctionRpcPb.AuctionsHistoryV2Request.create()

    request.perPage = perPage

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AuctionsHistoryV2Request,
      InjectiveAuctionRpcPb.AuctionsHistoryV2Response
    >(request, this.client.auctionsHistoryV2.bind(this.client))

    return IndexerGrpcAuctionTransformer.auctionsHistoryV2ResponseToAuctionHistory(
      response,
    )
  }

  async fetchAuctionV2(round: number | string = -1) {
    const request = InjectiveAuctionRpcPb.AuctionV2Request.create()

    if (round) {
      request.round = BigInt(round)
    }

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AuctionV2Request,
      InjectiveAuctionRpcPb.AuctionV2Response
    >(request, this.client.auctionV2.bind(this.client))

    return IndexerGrpcAuctionTransformer.grpcAuctionV2ToAuctionV2(response)
  }

  async fetchAccountAuctionsV2({
    token,
    address,
    perPage = 5,
  }: {
    token?: string
    address: string
    perPage?: number
  }) {
    const request = InjectiveAuctionRpcPb.AccountAuctionsV2Request.create()

    request.address = address
    request.perPage = perPage

    if (token) {
      request.token = token.toString()
    }

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AccountAuctionsV2Request,
      InjectiveAuctionRpcPb.AccountAuctionsV2Response
    >(request, this.client.accountAuctionsV2.bind(this.client))

    return IndexerGrpcAuctionTransformer.accountAuctionsV2ResponseToAccountAuctionsV2(
      response,
    )
  }

  async fetchAuctionStats() {
    const request = InjectiveAuctionRpcPb.AuctionsStatsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionRpcPb.AuctionsStatsRequest,
      InjectiveAuctionRpcPb.AuctionsStatsResponse
    >(request, this.client.auctionsStats.bind(this.client))

    return IndexerGrpcAuctionTransformer.auctionStatsResponseToAuctionStats(
      response,
    )
  }
}
