// Test import for bundle analysis - comprehensive imports
import {
  // Core modules
  MsgSend,
  MsgDelegate,

  // Client APIs
  ChainRestBankApi,
  ChainGrpcBankApi,
  // Utils
  MsgBroadcasterWithPk,
  IndexerGrpcAccountApi,
} from '../dist/esm/index.js'

// Use the imports to ensure they're included in the bundle
console.log('SDK-TS package loaded:', {
  MsgSend: MsgSend.name,
  MsgDelegate: MsgDelegate.name,
  ChainRestBankApi: ChainRestBankApi.name,
  ChainGrpcBankApi: ChainGrpcBankApi.name,
  IndexerGrpcAccountApi: IndexerGrpcAccountApi.name,
  MsgBroadcasterWithPk: MsgBroadcasterWithPk.name,
})
