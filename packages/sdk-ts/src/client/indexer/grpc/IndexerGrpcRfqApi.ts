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
    clientId,
    marketId,
    quantity,
    direction,
    worstPrice,
    priceCheck,
    requestAddress,
    transactionTime,
  }: {
    margin: string
    expiry?: bigint
    marketId: string
    quantity: string
    direction: string
    clientId?: string
    worstPrice: string
    priceCheck?: boolean
    requestAddress?: string
    transactionTime?: bigint
  }) {
    const request = InjectiveRFQExchangeRpcPb.RFQRequestInputType.create()

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

    if (transactionTime) {
      request.transactionTime = transactionTime
    }

    if (priceCheck) {
      request.priceCheck = priceCheck
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

  async createConditionalOrder({
    margin,
    orderId,
    marketId,
    quantity,
    direction,
    orderType,
    signature,
    worstPrice,
    triggerPrice,
    requestAddress,
  }: {
    margin: string
    orderId: string
    marketId: string
    quantity: string
    direction: string
    orderType: string
    signature: string
    worstPrice: string
    triggerPrice: string
    requestAddress: string
  }) {
    const order = InjectiveRFQExchangeRpcPb.ConditionalOrderInputType.create()

    order.margin = margin
    order.orderId = orderId
    order.marketId = marketId
    order.quantity = quantity
    order.direction = direction
    order.orderType = orderType
    order.signature = signature
    order.worstPrice = worstPrice
    order.triggerPrice = triggerPrice
    order.requestAddress = requestAddress

    const request =
      InjectiveRFQExchangeRpcPb.CreateConditionalOrderRequest.create()
    request.order = order

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.CreateConditionalOrderRequest,
      InjectiveRFQExchangeRpcPb.CreateConditionalOrderResponse
    >(request, this.client.createConditionalOrder.bind(this.client))

    return {
      order: response.order
        ? IndexerGrpcRfqTransformer.grpcConditionalOrderToConditionalOrder(
            response.order,
          )
        : undefined,
    }
  }

  async listConditionalOrders(params?: {
    token?: string
    status?: string
    perPage?: number
    marketId?: string
    requestAddress?: string
  }) {
    const { requestAddress, status, marketId, perPage, token } = params || {}
    const request =
      InjectiveRFQExchangeRpcPb.ListConditionalOrdersRequest.create()

    if (requestAddress) {
      request.requestAddress = requestAddress
    }

    if (status) {
      request.status = status
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.ListConditionalOrdersRequest,
      InjectiveRFQExchangeRpcPb.ListConditionalOrdersResponse
    >(request, this.client.listConditionalOrders.bind(this.client))

    return IndexerGrpcRfqTransformer.listConditionalOrdersResponseToConditionalOrders(
      response,
    )
  }

  async cancelConditionalOrder({
    orderId,
    requestAddress,
    signature,
  }: {
    orderId: string
    requestAddress: string
    signature: string
  }) {
    const request =
      InjectiveRFQExchangeRpcPb.CancelConditionalOrderRequest.create()

    request.orderId = orderId
    request.requestAddress = requestAddress
    request.signature = signature

    const response = await this.executeGrpcCall<
      InjectiveRFQExchangeRpcPb.CancelConditionalOrderRequest,
      InjectiveRFQExchangeRpcPb.CancelConditionalOrderResponse
    >(request, this.client.cancelConditionalOrder.bind(this.client))

    return {
      order: response.order
        ? IndexerGrpcRfqTransformer.grpcConditionalOrderToConditionalOrder(
            response.order,
          )
        : undefined,
    }
  }
}
