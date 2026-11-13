import * as InjectiveArchiverRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerArchiverStreamTransformer } from '../../transformers/index.js'
import type { StreamStatusResponse } from '../../types/index.js'
import type { LegacyStreamSubscription } from './streamHelpers.js'

export type SpotAverageEntriesStreamCallback = (
  response: ReturnType<
    typeof IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to archiver data from Injective Indexer
 */
export class IndexerGrpcArchiverStream {
  private client: InjectiveArchiverRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveArchiverRPCClient(this.transport)
  }

  /**
   * Stream spot average entries
   * @param params - Stream parameters
   * @param params.account - The account address to stream entries for
   * @param params.callback - Called for each average entry update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamSpotAverageEntries({
    account,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    account: string
    callback: SpotAverageEntriesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (!account) {
      throw new Error('account is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveArchiverRpcPb.StreamSpotAverageEntriesRequest.create()

    request.account = account

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamSpotAverageEntries(request, { abort: abortSignal }),
      (response: InjectiveArchiverRpcPb.StreamSpotAverageEntriesResponse) => {
        callback(
          IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }
}
