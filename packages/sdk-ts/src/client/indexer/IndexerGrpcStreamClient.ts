import { IndexerGrpcAccountStream } from './grpc_stream/IndexerGrpcAccountStream.js'
import { IndexerGrpcAccountPortfolioStream } from './grpc_stream/IndexerGrpcAccountPortfolioStream.js'
import { IndexerGrpcAuctionStream } from './grpc_stream/IndexerGrpcAuctionStream.js'
import { IndexerGrpcDerivativesStream } from './grpc_stream/IndexerGrpcDerivativesStream.js'
import { IndexerGrpcOracleStream } from './grpc_stream/IndexerGrpcOracleStream.js'
import { IndexerGrpcSpotStream } from './grpc_stream/IndexerGrpcSpotStream.js'
import { IndexerGrpcExplorerStream } from './grpc_stream/IndexerGrpcExplorerStream.js'

/**
 * @category Indexer Grpc API
 * @hidden
 */
export class IndexerGrpcStreamClient {
  derivatives: IndexerGrpcDerivativesStream

  spot: IndexerGrpcSpotStream

  account: IndexerGrpcAccountStream

  accountPortfolio: IndexerGrpcAccountPortfolioStream

  auction: IndexerGrpcAuctionStream

  oracle: IndexerGrpcOracleStream

  explorer: IndexerGrpcExplorerStream

  constructor(endpoint: string) {
    this.account = new IndexerGrpcAccountStream(endpoint)
    this.accountPortfolio = new IndexerGrpcAccountPortfolioStream(endpoint)
    this.auction = new IndexerGrpcAuctionStream(endpoint)
    this.derivatives = new IndexerGrpcDerivativesStream(endpoint)
    this.explorer = new IndexerGrpcExplorerStream(endpoint)
    this.oracle = new IndexerGrpcOracleStream(endpoint)
    this.spot = new IndexerGrpcSpotStream(endpoint)
  }
}
