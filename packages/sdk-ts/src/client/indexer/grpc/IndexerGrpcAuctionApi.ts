import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcAuctionTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchAuction(round?: number) {
    const request = InjectiveAuctionRpc.AuctionEndpointRequest.create()

    /**
     * If round is provided, set it on the request,
     * otherwise fetch latest round
     **/
    if (round) {
      request.round = round.toString()
    }

    try {
      const response =
        await this.retry<InjectiveAuctionRpc.AuctionEndpointResponse>(() =>
          this.client.AuctionEndpoint(request),
        )

      return IndexerGrpcAuctionTransformer.auctionResponseToAuction(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AuctionEndpoint',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionEndpoint',
        contextModule: this.module,
      })
    }
  }

  async fetchAuctions() {
    const request = InjectiveAuctionRpc.AuctionsRequest.create()

    try {
      const response = await this.retry<InjectiveAuctionRpc.AuctionsResponse>(
        () => this.client.Auctions(request),
      )

      return IndexerGrpcAuctionTransformer.auctionsResponseToAuctions(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Auctions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Auctions',
        contextModule: this.module,
      })
    }
  }
}
