import { Network } from '@injectivelabs/networks'
import { TokenMetaUtil } from './TokenMetaUtil'
import {
  tokensBySymbol,
  tokensBySymbolForDevnet,
  tokensBySymbolForDevnet1,
  tokensBySymbolForTestnet,
} from './tokens'

export class TokenMetaUtilFactory {
  static make(network: Network = Network.MainnetOld): TokenMetaUtil {
    switch (network) {
      case Network.Mainnet:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.MainnetOld:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.MainnetK8s:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.MainnetStaging:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.Devnet:
        return new TokenMetaUtil(tokensBySymbolForDevnet)
      case Network.Devnet1:
        return new TokenMetaUtil(tokensBySymbolForDevnet1)
      case Network.Local:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.Testnet:
        return new TokenMetaUtil(tokensBySymbolForTestnet)
      case Network.TestnetK8s:
        return new TokenMetaUtil(tokensBySymbolForTestnet)
      default:
        return new TokenMetaUtil(tokensBySymbol)
    }
  }
}
