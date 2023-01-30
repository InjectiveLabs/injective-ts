import {
  InjectiveAuctionRPCClientImpl,
  AuctionRequest,
  AuctionsRequest,
} from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'
import { IndexerGrpcAuctionTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/indexer-proto-ts/injective_explorer_rpc'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAuctionRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchAuction(round?: number) {
    const request = AuctionRequest.create()

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
      if (e instanceof GrpcWebError) {
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
    const request = AuctionsRequest.create()

    try {
      const response = await this.client.Auctions(request)

      return IndexerGrpcAuctionTransformer.auctionsResponseToAuctions(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
