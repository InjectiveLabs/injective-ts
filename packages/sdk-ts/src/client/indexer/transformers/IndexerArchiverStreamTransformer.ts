import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcArchiverTransformer } from './IndexerGrpcArchiverTransformer.js'
import type * as InjectiveArchiverRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerArchiverStreamTransformer {
  static spotAverageEntriesStreamCallback = (
    response: InjectiveArchiverRpcPb.StreamSpotAverageEntriesResponse,
  ) => {
    const averageEntry = response.averageEntry

    return {
      averageEntry: averageEntry
        ? IndexerGrpcArchiverTransformer.grpcSpotAverageEntryToSpotAverageEntry(
            averageEntry,
          )
        : undefined,
      operation: StreamOperation.Update,
      timestamp:
        typeof response.timestamp === 'bigint'
          ? Number(response.timestamp)
          : response.timestamp,
    }
  }
}
