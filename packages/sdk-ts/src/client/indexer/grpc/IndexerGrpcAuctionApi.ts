import { IndexerGrpcAuctionTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
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
      const response = await this.client.AuctionEndpoint(request)

      return IndexerGrpcAuctionTransformer.auctionResponseToAuction(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchAuctions() {
    const request = InjectiveAuctionRpc.AuctionsRequest.create()

    try {
      const response = await this.client.Auctions(request)

      return IndexerGrpcAuctionTransformer.auctionsResponseToAuctions(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
