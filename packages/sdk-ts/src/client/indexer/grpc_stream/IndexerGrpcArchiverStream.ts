import { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'
import { IndexerArchiverStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'

export type SpotAverageEntriesStreamCallback = (
  response: ReturnType<
    typeof IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcArchiverStream {
  protected client: InjectiveArchiverRpc.InjectiveArchiverRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveArchiverRpc.InjectiveArchiverRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamSpotAverageEntries({
    account,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    account: string
    callback: SpotAverageEntriesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request =
      InjectiveArchiverRpc.StreamSpotAverageEntriesRequest.create()

    request.account = account

    const subscription = this.client
      .StreamSpotAverageEntries(request)
      .subscribe({
        next(response: InjectiveArchiverRpc.StreamSpotAverageEntriesResponse) {
          callback(
            IndexerArchiverStreamTransformer.spotAverageEntriesStreamCallback(
              response,
            ),
          )
        },
        error(err) {
          if (onStatusCallback) {
            onStatusCallback(err)
          }
        },
        complete() {
          if (onEndCallback) {
            onEndCallback()
          }
        },
      })

    return subscription as unknown as Subscription
  }
}
