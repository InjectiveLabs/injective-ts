// Test tree-shaking for client chain module
import {
  ChainRestBankApi,
  ChainGrpcBankApi,
  ChainGrpcExchangeApi,
  ChainGrpcStakingApi
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Client Chain module loaded:', {
  ChainRestBankApi: ChainRestBankApi.name,
  ChainGrpcBankApi: ChainGrpcBankApi.name,
  ChainGrpcExchangeApi: ChainGrpcExchangeApi.name,
  ChainGrpcStakingApi: ChainGrpcStakingApi.name
})
