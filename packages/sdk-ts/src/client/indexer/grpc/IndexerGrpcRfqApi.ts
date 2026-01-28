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

  async submitRequest({
    rfqId,
    margin,
    expiry,
    status,
    height,
    marketId,
    quantity,
    direction,
    createdAt,
    updatedAt,
    worstPrice,
    requestAddress,
    transactionTime,
  }: {
    rfqId?: bigint
    margin: string
    expiry?: bigint
    status?: string
    height?: bigint
    marketId: string
    quantity: string
    direction: string
    worstPrice: string
    createdAt?: bigint
    updatedAt?: bigint
    requestAddress?: string
    transactionTime?: bigint
  }) {
    const request = InjectiveRFQExchangeRpcPb.RFQRequestType.create()

    if (rfqId !== undefined) {
      request.rfqId = rfqId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (direction) {
      request.direction = direction
    }

    if (margin) {
      request.margin = margin
    }

    if (quantity) {
      request.quantity = quantity
    }

    if (worstPrice) {
      request.worstPrice = worstPrice
    }

    if (requestAddress) {
      request.requestAddress = requestAddress
    }

    if (expiry) {
      request.expiry = expiry
    }

    if (status) {
      request.status = status
    }

    if (createdAt) {
      request.createdAt = createdAt
    }

    if (updatedAt) {
      request.updatedAt = updatedAt
    }

    if (transactionTime) {
      request.transactionTime = transactionTime
    }

    if (height) {
      request.height = height
    }

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

  async submitQuote({
    rfqId,
    price,
    maker,
    taker,
    margin,
    expiry,
    status,
    height,
    marketId,
    quantity,
    signature,
    createdAt,
    updatedAt,
    eventTime,
    takerDirection,
    transactionTime,
  }: {
    rfqId?: bigint
    price: string
    maker: string
    taker: string
    margin: string
    expiry?: bigint
    status?: string
    height?: bigint
    marketId: string
    quantity: string
    signature: string
    createdAt?: bigint
    updatedAt?: bigint
    eventTime?: bigint
    takerDirection: string
    transactionTime?: bigint
  }): Promise<{ status: string }> {
    const request = InjectiveRFQExchangeRpcPb.RFQQuoteType.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (rfqId !== undefined) {
      request.rfqId = rfqId
    }

    if (takerDirection) {
      request.takerDirection = takerDirection
    }

    if (margin) {
      request.margin = margin
    }

    if (quantity) {
      request.quantity = quantity
    }

    if (price) {
      request.price = price
    }

    if (expiry) {
      request.expiry = expiry
    }

    if (maker) {
      request.maker = maker
    }

    if (taker) {
      request.taker = taker
    }

    if (signature) {
      request.signature = signature
    }

    if (status) {
      request.status = status
    }

    if (createdAt) {
      request.createdAt = createdAt
    }

    if (updatedAt) {
      request.updatedAt = updatedAt
    }

    if (height) {
      request.height = height
    }

    if (eventTime) {
      request.eventTime = eventTime
    }

    if (transactionTime) {
      request.transactionTime = transactionTime
    }

    const quoteMessage = InjectiveRFQExchangeRpcPb.QuoteRequest.create()
    quoteMessage.quote = request

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

    if (pagination?.skip) {
      request.skip = BigInt(pagination.skip)
    }

    if (pagination?.limit) {
      request.limit = BigInt(pagination.limit)
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
