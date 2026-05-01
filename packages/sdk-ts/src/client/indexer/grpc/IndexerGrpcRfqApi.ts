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
    order,
    signMode,
    signature,
    evmChainId,
  }: {
    signMode: string
    signature: string
    evmChainId: bigint
    order: {
      cid?: string
      taker: string
      rfqId: bigint
      epoch: bigint
      margin: string
      version: number
      chainId: string
      marketId: string
      quantity: string
      direction: string
      worstPrice: string
      deadlineMs: bigint
      triggerType: string
      laneVersion: bigint
      triggerPrice: string
      contractAddress: string
      subaccountNonce: number
      allowedRelayer?: string
      unfilledAction?: string
      minTotalFillQuantity: string
    }
  }) {
    const conditionalOrderInput =
      InjectiveRFQExchangeRpcPb.ConditionalOrderInput.create()

    conditionalOrderInput.taker = order.taker
    conditionalOrderInput.rfqId = order.rfqId
    conditionalOrderInput.epoch = order.epoch
    conditionalOrderInput.margin = order.margin
    conditionalOrderInput.version = order.version
    conditionalOrderInput.chainId = order.chainId
    conditionalOrderInput.marketId = order.marketId
    conditionalOrderInput.quantity = order.quantity
    conditionalOrderInput.direction = order.direction
    conditionalOrderInput.worstPrice = order.worstPrice
    conditionalOrderInput.deadlineMs = order.deadlineMs
    conditionalOrderInput.triggerType = order.triggerType
    conditionalOrderInput.laneVersion = order.laneVersion
    conditionalOrderInput.triggerPrice = order.triggerPrice
    conditionalOrderInput.contractAddress = order.contractAddress
    conditionalOrderInput.subaccountNonce = order.subaccountNonce
    conditionalOrderInput.minTotalFillQuantity = order.minTotalFillQuantity

    if (order.cid) {
      conditionalOrderInput.cid = order.cid
    }

    if (order.allowedRelayer) {
      conditionalOrderInput.allowedRelayer = order.allowedRelayer
    }

    if (order.unfilledAction) {
      conditionalOrderInput.unfilledAction = order.unfilledAction
    }

    const request =
      InjectiveRFQExchangeRpcPb.CreateConditionalOrderRequest.create()

    request.order = conditionalOrderInput
    request.signature = signature
    request.signMode = signMode
    request.evmChainId = evmChainId

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
    status?: string[]
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

    if (status && status.length > 0) {
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
}
