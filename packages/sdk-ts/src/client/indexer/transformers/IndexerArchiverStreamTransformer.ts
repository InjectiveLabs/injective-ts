import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcArchiverTransformer } from './IndexerGrpcArchiverTransformer.js'
import type { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerArchiverStreamTransformer {
  static spotAverageEntriesStreamCallback = (
    response: InjectiveArchiverRpc.StreamSpotAverageEntriesResponse,
  ) => {
    const averageEntry = response.averageEntry

    return {
      averageEntry: averageEntry
        ? IndexerGrpcArchiverTransformer.grpcSpotAverageEntryToSpotAverageEntry(
            averageEntry,
          )
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.timestamp,
    }
  }
}
