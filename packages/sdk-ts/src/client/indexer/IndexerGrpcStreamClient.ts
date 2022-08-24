import { IndexerGrpcAccountStream } from './grpc_stream/IndexerGrpcAccountStream'
import { IndexerGrpcAuctionStream } from './grpc_stream/IndexerGrpcAuctionStream'
import { IndexerGrpcDerivativesStream } from './grpc_stream/IndexerGrpcDerivativesStream'
import { IndexerGrpcOracleStream } from './grpc_stream/IndexerGrpcOracleStream'
import { IndexerGrpcSpotStream } from './grpc_stream/IndexerGrpcSpotStream'
import { IndexerGrpcExplorerStream } from './grpc_stream/IndexerGrpcExplorerStream'

/**
 * @category Indexer Grpc API
 * @hidden
 */
export class IndexerGrpcStreamClient {
  derivatives: IndexerGrpcDerivativesStream

  spot: IndexerGrpcSpotStream

  account: IndexerGrpcAccountStream

  auction: IndexerGrpcAuctionStream

  oracle: IndexerGrpcOracleStream

  explorer: IndexerGrpcExplorerStream

  constructor(endpoint: string) {
    this.derivatives = new IndexerGrpcDerivativesStream(endpoint)
    this.spot = new IndexerGrpcSpotStream(endpoint)
    this.account = new IndexerGrpcAccountStream(endpoint)
    this.auction = new IndexerGrpcAuctionStream(endpoint)
    this.oracle = new IndexerGrpcOracleStream(endpoint)
    this.explorer = new IndexerGrpcExplorerStream(endpoint)
  }
}
