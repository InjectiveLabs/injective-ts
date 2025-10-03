// Test tree-shaking for proto dependencies
import { ChainGrpcBankApi, IndexerGrpcAccountApi } from '../dist/esm/index.js'

// This will include the proto dependencies
console.log('Proto dependencies loaded:', {
  ChainGrpcBankApi: ChainGrpcBankApi.name,
  IndexerGrpcAccountApi: IndexerGrpcAccountApi.name,
})
