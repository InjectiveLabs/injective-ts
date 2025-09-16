// Test tree-shaking for client chain gRPC APIs only
import {
  ChainGrpcBankApi
} from '../dist/esm/index.js'

console.log('Client Chain gRPC only loaded:', {
  ChainGrpcBankApi: ChainGrpcBankApi.name
})
