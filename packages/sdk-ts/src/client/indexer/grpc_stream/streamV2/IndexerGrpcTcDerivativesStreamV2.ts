import * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import { InjectiveTCDerivativesRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerTcDerivativesStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type TcDerivativeOrderHistoryStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type TcDerivativeTradesStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.tradesStreamCallback
  >,
) => void

export type TcDerivativePositionsStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.positionsStreamCallback
  >,
) => void

export type TcDerivativeOrdersStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.ordersStreamCallback
  >,
) => void

export class IndexerGrpcTcDerivativesStreamV2 {
  private client: InjectiveTCDerivativesRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveTCDerivativesRPCClient(this.transport)
  }

  streamOrdersHistory({
    marketId,
    accountAddress,
    callback,
  }: {
    marketId?: string
    accountAddress?: string
    callback: TcDerivativeOrderHistoryStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveTCDerivativesRpcPb.StreamOrdersHistoryRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const stream = this.client.streamOrdersHistory(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerTcDerivativesStreamTransformer.orderHistoryStreamCallback(
          response as InjectiveTCDerivativesRpcPb.StreamOrdersHistoryResponse,
        )

      callback(transformed)
    })
  }

  streamTrades({
    marketId,
    accountAddress,
    callback,
  }: {
    marketId?: string
    accountAddress?: string
    callback: TcDerivativeTradesStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveTCDerivativesRpcPb.StreamTradesRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const stream = this.client.streamTrades(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerTcDerivativesStreamTransformer.tradesStreamCallback(
          response as InjectiveTCDerivativesRpcPb.StreamTradesResponse,
        )

      callback(transformed)
    })
  }

  streamPositions({
    marketId,
    accountAddress,
    callback,
  }: {
    marketId?: string
    accountAddress?: string
    callback: TcDerivativePositionsStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveTCDerivativesRpcPb.StreamPositionsRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const stream = this.client.streamPositions(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerTcDerivativesStreamTransformer.positionsStreamCallback(
          response as InjectiveTCDerivativesRpcPb.StreamPositionsResponse,
        )

      callback(transformed)
    })
  }

  streamOrders({
    marketId,
    accountAddress,
    callback,
  }: {
    marketId?: string
    accountAddress?: string
    callback: TcDerivativeOrdersStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveTCDerivativesRpcPb.StreamOrdersRequest.create()

    if (marketId) {
      request.marketIds = [marketId]
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    const stream = this.client.streamOrders(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerTcDerivativesStreamTransformer.ordersStreamCallback(
          response as InjectiveTCDerivativesRpcPb.StreamOrdersResponse,
        )

      callback(transformed)
    })
  }
}
