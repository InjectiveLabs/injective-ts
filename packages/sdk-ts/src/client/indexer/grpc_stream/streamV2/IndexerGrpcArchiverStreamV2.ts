import * as InjectiveArchiverRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerArchiverStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type SpotAverageEntriesStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback
  >,
) => void

export class IndexerGrpcArchiverStreamV2 {
  private client: InjectiveArchiverRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveArchiverRPCClient(this.transport)
  }

  /**
   * Stream spot average entries
   * @param params.account - The account address to stream entries for
   * @param params.callback - Called for each average entry update
   * @returns StreamSubscription
   */
  streamSpotAverageEntries({
    account,
    callback,
  }: {
    account: string
    callback: SpotAverageEntriesStreamCallbackV2
  }): StreamSubscription {
    if (!account) {
      throw new Error('account is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveArchiverRpcPb.StreamSpotAverageEntriesRequest.create()

    request.account = account

    const stream = this.client.streamSpotAverageEntries(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback(
          response,
        )
      callback(transformed)
    })
  }
}
