import * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb'
import { InjectiveRFQRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfqrpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { IndexerRfqStreamTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

export type RequestStreamCallback = (
  response: ReturnType<
    typeof IndexerRfqStreamTransformer.requestStreamCallback
  >,
) => void

export type QuoteStreamCallback = (
  response: ReturnType<typeof IndexerRfqStreamTransformer.quoteStreamCallback>,
) => void

export type SettlementStreamCallback = (
  response: ReturnType<
    typeof IndexerRfqStreamTransformer.settlementStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to RFQ data from Injective Indexer
 */
export class IndexerGrpcRfqStream {
  private client: InjectiveRFQRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveRFQRPCClient(this.transport)
  }

  /**
   * Stream RFQ requests
   * @param params - Stream parameters
   * @param params.marketIds - Filter by market IDs (optional)
   * @param params.callback - Called for each request update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamRequests({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: RequestStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamRequestRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamRequest(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveRFQRpcPb.StreamRequestResponse) => {
        callback(IndexerRfqStreamTransformer.requestStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream RFQ quotes
   * @param params - Stream parameters
   * @param params.addresses - Filter by addresses (optional)
   * @param params.callback - Called for each quote update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamQuotes({
    addresses,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    addresses?: string[]
    callback: QuoteStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamQuoteRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    const stream = this.client.streamQuote(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveRFQRpcPb.StreamQuoteResponse) => {
        callback(IndexerRfqStreamTransformer.quoteStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream RFQ settlements
   * @param params - Stream parameters
   * @param params.addresses - Filter by addresses (optional)
   * @param params.callback - Called for each settlement update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamSettlements({
    addresses,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    addresses?: string[]
    callback: SettlementStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamSettlementRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    const stream = this.client.streamSettlement(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveRFQRpcPb.StreamSettlementResponse) => {
        callback(IndexerRfqStreamTransformer.settlementStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
