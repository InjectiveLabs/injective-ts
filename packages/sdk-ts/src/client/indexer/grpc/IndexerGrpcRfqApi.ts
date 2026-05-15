import * as InjectiveRFQExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import { InjectiveRfqRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcRfqTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { RFQSignMode } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRFQApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RFQ

  private get client() {
    return this.initClient(InjectiveRfqRPCClient)
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
    signature: string
    evmChainId: bigint
    signMode: RFQSignMode
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
      takerNonceTimeWindowMs?: bigint
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

    if (order.takerNonceTimeWindowMs) {
      conditionalOrderInput.takerNonceTimeWindowMs =
        order.takerNonceTimeWindowMs
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
