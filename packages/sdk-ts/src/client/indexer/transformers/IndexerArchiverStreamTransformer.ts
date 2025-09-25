import { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'
import { IndexerGrpcArchiverTransformer } from './IndexerGrpcArchiverTransformer.js'
import { StreamOperation } from '../../../types/index.js'

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
