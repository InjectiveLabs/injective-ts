import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
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
          this.client.AuctionEndpoint(request, this.metadata),
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
        () => this.client.Auctions(request, this.metadata),
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

  async fetchInjBurnt() {
    const request: InjectiveAuctionRpc.InjBurntEndpointRequest = {}

    try {
      const response =
        await this.retry<InjectiveAuctionRpc.InjBurntEndpointResponse>(() =>
          this.client.InjBurntEndpoint(request, this.metadata),
        )

      return Number(response.totalInjBurnt)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'InjBurntEndpoint',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'InjBurntEndpoint',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveAuctionRpc.AuctionsHistoryV2Request.create()

    request.perPage = perPage

    if (endTime) {
      request.endTime = endTime
    }

    if (token) {
      request.token = token
    }

    try {
      const response =
        await this.retry<InjectiveAuctionRpc.AuctionsHistoryV2Response>(() =>
          this.client.AuctionsHistoryV2(request, this.metadata),
        )

      return IndexerGrpcAuctionTransformer.auctionsHistoryV2ResponseToAuctionHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AuctionsV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionsV2',
        contextModule: this.module,
      })
    }
  }

  async fetchAuctionV2(round: number | string = -1) {
    const request = InjectiveAuctionRpc.AuctionV2Request.create()

    if (round) {
      request.round = round.toString()
    }

    try {
      const response = await this.retry<InjectiveAuctionRpc.AuctionV2Response>(
        () => this.client.AuctionV2(request, this.metadata),
      )

      return IndexerGrpcAuctionTransformer.grpcAuctionV2ToAuctionV2(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AuctionV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionV2',
        contextModule: this.module,
      })
    }
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
    const request = InjectiveAuctionRpc.AccountAuctionsV2Request.create()

    request.address = address
    request.perPage = perPage

    if (token) {
      request.token = token.toString()
    }

    try {
      const response =
        await this.retry<InjectiveAuctionRpc.AccountAuctionsV2Response>(() =>
          this.client.AccountAuctionsV2(request, this.metadata),
        )

      return IndexerGrpcAuctionTransformer.accountAuctionsV2ResponseToAccountAuctionsV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AccountAuctionsV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AccountAuctionsV2',
        contextModule: this.module,
      })
    }
  }
}
