// Test tree-shaking for client chain REST APIs only
import { ChainRestBankApi } from '../dist/esm/index.js'

console.log('Client Chain REST only loaded:', {
  ChainRestBankApi: ChainRestBankApi.name,
})
