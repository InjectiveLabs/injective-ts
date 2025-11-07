// Test tree-shaking for client indexer module
import {
  IndexerGrpcMetaApi,
  IndexerGrpcSpotApi,
  IndexerGrpcOracleApi,
  IndexerGrpcAccountApi,
  IndexerGrpcAuctionApi,
  IndexerGrpcExplorerApi,
  IndexerGrpcDerivativesApi,
  IndexerGrpcTransactionApi,
  IndexerGrpcInsuranceFundApi,
  IndexerGrpcAccountPortfolioApi,
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Client Indexer module loaded:', {
  IndexerGrpcAccountApi: IndexerGrpcAccountApi.name,
  IndexerGrpcAuctionApi: IndexerGrpcAuctionApi.name,
  IndexerGrpcDerivativesApi: IndexerGrpcDerivativesApi.name,
  IndexerGrpcExplorerApi: IndexerGrpcExplorerApi.name,
  IndexerGrpcInsuranceFundApi: IndexerGrpcInsuranceFundApi.name,
  IndexerGrpcMetaApi: IndexerGrpcMetaApi.name,
  IndexerGrpcOracleApi: IndexerGrpcOracleApi.name,
  IndexerGrpcAccountPortfolioApi: IndexerGrpcAccountPortfolioApi.name,
  IndexerGrpcSpotApi: IndexerGrpcSpotApi.name,
  IndexerGrpcTransactionApi: IndexerGrpcTransactionApi.name,
})
