// Test tree-shaking with mixed imports from different modules
import {
  MsgSend,
  ChainRestBankApi,
  MsgBroadcasterWithPk
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('Mixed imports loaded:', {
  MsgSend: MsgSend.name,
  ChainRestBankApi: ChainRestBankApi.name,
  MsgBroadcasterWithPk: MsgBroadcasterWithPk.name
})
