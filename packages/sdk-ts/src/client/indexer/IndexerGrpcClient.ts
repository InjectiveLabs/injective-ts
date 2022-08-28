import { IndexerGrpcMetaApi } from './grpc/IndexerGrpcMetaApi'
import { IndexerGrpcAccountApi } from './grpc/IndexerGrpcAccountApi'
import { IndexerGrpcAuctionApi } from './grpc/IndexerGrpcAuctionApi'
import { IndexerGrpcExplorerApi } from './grpc/IndexerGrpcExplorerApi'
import { IndexerGrpcOracleApi } from './grpc/IndexerGrpcOracleApi'
import { IndexerGrpcInsuranceFundApi } from './grpc/IndexerGrpcInsuranceFundApi'
import { IndexerGrpcDerivativesApi } from './grpc/IndexerGrpcDerivativesApi'
import { IndexerGrpcSpotApi } from './grpc/IndexerGrpcSpotApi'

/**
 * @category Indexer Grpc API
 * @hidden
 */
export class IndexerGrpcClient {
  account: IndexerGrpcAccountApi

  auction: IndexerGrpcAuctionApi

  explorer: IndexerGrpcExplorerApi

  meta: IndexerGrpcMetaApi

  oracle: IndexerGrpcOracleApi

  insuranceFund: IndexerGrpcInsuranceFundApi

  derivatives: IndexerGrpcDerivativesApi

  spot: IndexerGrpcSpotApi

  constructor(endpoint: string) {
    this.account = new IndexerGrpcAccountApi(endpoint)
    this.auction = new IndexerGrpcAuctionApi(endpoint)
    this.explorer = new IndexerGrpcExplorerApi(endpoint)
    this.meta = new IndexerGrpcMetaApi(endpoint)
    this.oracle = new IndexerGrpcOracleApi(endpoint)
    this.insuranceFund = new IndexerGrpcInsuranceFundApi(endpoint)
    this.derivatives = new IndexerGrpcDerivativesApi(endpoint)
    this.spot = new IndexerGrpcSpotApi(endpoint)
  }
}
