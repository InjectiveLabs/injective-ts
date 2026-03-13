import * as InjectiveTCDerivativesRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb'
import { InjectiveTCDerivativesRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_tc_derivatives_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerTcDerivativesStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type OrderHistoryStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type TradesStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerTcDerivativesStreamTransformer.tradesStreamCallback
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
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: OrderHistoryStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveTCDerivativesRpcPb.StreamOrdersHistoryRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
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
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: TradesStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveTCDerivativesRpcPb.StreamTradesRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
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
}
