import { IndexerGrpcAccountStream } from './grpc_stream/IndexerGrpcAccountStream'
import { IndexerGrpcAccountPortfolioStream } from './grpc_stream/IndexerGrpcAccountPortfolioStream'
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
