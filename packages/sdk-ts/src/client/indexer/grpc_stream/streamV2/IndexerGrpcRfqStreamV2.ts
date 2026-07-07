import * as InjectiveRFQRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb'
import { InjectiveRfqRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { IndexerRfqStreamTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type RequestStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerRfqStreamTransformer.requestStreamCallback
  >,
) => void

export type QuoteStreamCallbackV2 = (
  response: ReturnType<typeof IndexerRfqStreamTransformer.quoteStreamCallback>,
) => void

export type SettlementStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerRfqStreamTransformer.settlementStreamCallback
  >,
) => void

export class IndexerGrpcRfqStreamV2 {
  private client: InjectiveRfqRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveRfqRPCClient(this.transport)
  }

  streamRequests({
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: RequestStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamRequestRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamRequest(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerRfqStreamTransformer.requestStreamCallback(response)

        callback(transformed)
      },
    )
  }

  streamQuotes({
    addresses,
    marketIds,
    callback,
  }: {
    addresses?: string[]
    marketIds?: string[]
    callback: QuoteStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamQuoteRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    return createStreamSubscriptionV2(
      (abortSignal) => this.client.streamQuote(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerRfqStreamTransformer.quoteStreamCallback(response)

        callback(transformed)
      },
    )
  }

  streamSettlements({
    addresses,
    callback,
  }: {
    addresses?: string[]
    callback: SettlementStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveRFQRpcPb.StreamSettlementRequest.create()

    if (addresses && addresses.length > 0) {
      request.addresses = addresses
    }

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamSettlement(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerRfqStreamTransformer.settlementStreamCallback(response)

        callback(transformed)
      },
    )
  }
}
