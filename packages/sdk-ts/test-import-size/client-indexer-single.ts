// Test tree-shaking for single indexer API
import {
  IndexerGrpcAccountApi
} from '../dist/esm/index.js'

console.log('Single Indexer API loaded:', {
  IndexerGrpcAccountApi: IndexerGrpcAccountApi.name
})
