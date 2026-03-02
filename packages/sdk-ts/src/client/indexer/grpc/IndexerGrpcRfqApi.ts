import * as InjectiveRFQExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import { InjectiveRfqRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcRfqTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcRFQExpiry } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRFQApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RFQ

  private get client() {
    return this.initClient(InjectiveRfqRPCClient)
  }

  async submitRequest({
    margin,
    expiry,
    status,
    clientId,
    marketId,
    quantity,
    direction,
    worstPrice,
    requestAddress,
    transactionTime,
  }: {
    margin: string
    expiry?: bigint
    status?: string
    marketId: string
    quantity: string
    direction: string
    clientId?: string
    worstPrice: string
    requestAddress?: string
    transactionTime?: bigint
  }) {
    const request = InjectiveRFQExchangeRpcPb.RFQRequestType.create()

    if (clientId) {
      request.clientId = clientId
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

    if (transactionTime) {
      request.transactionTime = transactionTime
    }

    const requestMessage = InjectiveRFQExchangeRpcPb.RequestRequest.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.RequestRequest,
      InjectiveRFQExchangeRpcPb.RequestResponse
    >(requestMessage, this.client.request.bind(this.client))

    return { status: response.status }
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
    chainId,
    marketId,
    quantity,
    signature,
    createdAt,
    updatedAt,
    eventTime,
    takerDirection,
    contractAddress,
    transactionTime,
  }: {
    rfqId?: bigint
    price: string
    maker: string
    taker: string
    margin: string
    status?: string
    height?: bigint
    chainId: string
    marketId: string
    quantity: string
    signature: string
    createdAt?: bigint
    updatedAt?: bigint
    eventTime?: bigint
    takerDirection: string
    contractAddress: string
    transactionTime?: bigint
    expiry?: Partial<GrpcRFQExpiry>
  }): Promise<{ status: string }> {
    const request = InjectiveRFQExchangeRpcPb.RFQQuoteType.create()

    if (chainId) {
      request.chainId = chainId
    }

    if (contractAddress) {
      request.contractAddress = contractAddress
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (rfqId !== null && rfqId !== undefined) {
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
      request.expiry = {
        height: expiry.height ? BigInt(expiry.height) : BigInt(0),
        timestamp: expiry.timestamp ? BigInt(expiry.timestamp) : BigInt(0),
      }
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

  async fetchSettlements(params?: {
    token?: string
    perPage?: number
    addresses?: string[]
  }) {
    const { addresses, token, perPage } = params || {}
    const request = InjectiveRFQExchangeRpcPb.ListSettlementRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    if (token) {
      request.token = token
    }

    if (perPage) {
      request.perPage = perPage
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
