import * as InjectiveRFQExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'
import { InjectiveRFQRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcRfqTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { PaginationOption } from '../../../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRFQApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RFQ

  private get client() {
    return this.initClient(InjectiveRFQRPCClient)
  }

  async submitRequest(
    request: InjectiveRFQExchangeRpcPb.RFQRequestType,
  ): Promise<{ status: string }> {
    const requestMessage = InjectiveRFQExchangeRpcPb.RequestRequest.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.RequestRequest,
      InjectiveRFQExchangeRpcPb.RequestResponse
    >(requestMessage, this.client.request.bind(this.client))

    return { status: response.status }
  }

  async fetchOpenRequests() {
    const request = InjectiveRFQExchangeRpcPb.GetOpenRequestsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.GetOpenRequestsRequest,
      InjectiveRFQExchangeRpcPb.GetOpenRequestsResponse
    >(request, this.client.getOpenRequests.bind(this.client))

    return IndexerGrpcRfqTransformer.openRequestsResponseToOpenRequests(
      response,
    )
  }

  async submitQuote(
    quote: InjectiveRFQExchangeRpcPb.RFQQuoteType,
  ): Promise<{ status: string }> {
    const quoteMessage = InjectiveRFQExchangeRpcPb.QuoteRequest.create()
    quoteMessage.quote = quote

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.QuoteRequest,
      InjectiveRFQExchangeRpcPb.QuoteResponse
    >(quoteMessage, this.client.quote.bind(this.client))

    return { status: response.status }
  }

  async fetchPendingQuotes() {
    const request = InjectiveRFQExchangeRpcPb.GetPendingQuotesRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.GetPendingQuotesRequest,
      InjectiveRFQExchangeRpcPb.GetPendingQuotesResponse
    >(request, this.client.getPendingQuotes.bind(this.client))

    return IndexerGrpcRfqTransformer.pendingQuotesResponseToPendingQuotes(
      response,
    )
  }

  async fetchSettlements(params?: {
    addresses?: string[]
    pagination?: PaginationOption
  }) {
    const { addresses, pagination } = params || {}
    const request = InjectiveRFQExchangeRpcPb.ListSettlementRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = BigInt(pagination.limit)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.ListSettlementRequest,
      InjectiveRFQExchangeRpcPb.ListSettlementResponse
    >(request, this.client.listSettlement.bind(this.client))

    return IndexerGrpcRfqTransformer.listSettlementsResponseToSettlements(
      response,
    )
  }
}
