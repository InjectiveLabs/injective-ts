import { IndexerGrpcMetaApi } from './grpc/IndexerGrpcMetaApi.js'
import { IndexerGrpcAccountApi } from './grpc/IndexerGrpcAccountApi.js'
import { IndexerGrpcAccountPortfolioApi } from './grpc/IndexerGrpcPortfolioApi.js'
import { IndexerGrpcAuctionApi } from './grpc/IndexerGrpcAuctionApi.js'
import { IndexerGrpcExplorerApi } from './grpc/IndexerGrpcExplorerApi.js'
import { IndexerGrpcOracleApi } from './grpc/IndexerGrpcOracleApi.js'
import { IndexerGrpcInsuranceFundApi } from './grpc/IndexerGrpcInsuranceFundApi.js'
import { IndexerGrpcDerivativesApi } from './grpc/IndexerGrpcDerivativesApi.js'
import { IndexerGrpcSpotApi } from './grpc/IndexerGrpcSpotApi.js'

/**
 * @category Indexer Grpc API
 * @hidden
 */
export class IndexerGrpcClient {
  account: IndexerGrpcAccountApi

  accountPortfolio: IndexerGrpcAccountPortfolioApi

  auction: IndexerGrpcAuctionApi

  explorer: IndexerGrpcExplorerApi

  meta: IndexerGrpcMetaApi

  oracle: IndexerGrpcOracleApi

  insuranceFund: IndexerGrpcInsuranceFundApi

  derivatives: IndexerGrpcDerivativesApi

  spot: IndexerGrpcSpotApi

  constructor(endpoint: string) {
    this.account = new IndexerGrpcAccountApi(endpoint)
    this.accountPortfolio = new IndexerGrpcAccountPortfolioApi(endpoint)
    this.auction = new IndexerGrpcAuctionApi(endpoint)
    this.explorer = new IndexerGrpcExplorerApi(endpoint)
    this.meta = new IndexerGrpcMetaApi(endpoint)
    this.oracle = new IndexerGrpcOracleApi(endpoint)
    this.insuranceFund = new IndexerGrpcInsuranceFundApi(endpoint)
    this.derivatives = new IndexerGrpcDerivativesApi(endpoint)
    this.spot = new IndexerGrpcSpotApi(endpoint)
  }
}
