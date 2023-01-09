import { Network } from '@injectivelabs/networks'
import { TokenMetaUtil } from './TokenMetaUtil'
import {
  tokensBySymbol,
  tokensBySymbolForDevnet,
  tokensBySymbolForDevnet1,
  tokensBySymbolForDevnet2,
  tokensBySymbolForTestnet,
} from './tokens'

export class TokenMetaUtilFactory {
  static make(network: Network = Network.Mainnet): TokenMetaUtil {
    switch (network) {
      case Network.Mainnet:
      case Network.MainnetK8s:
      case Network.Local:
        return new TokenMetaUtil(tokensBySymbol)
      case Network.Devnet:
        return new TokenMetaUtil(tokensBySymbolForDevnet)
      case Network.Devnet1:
        return new TokenMetaUtil(tokensBySymbolForDevnet1)
      case Network.Devnet2:
        return new TokenMetaUtil(tokensBySymbolForDevnet2)
      case Network.Testnet:
      case Network.TestnetOld:
      case Network.TestnetK8s:
        return new TokenMetaUtil(tokensBySymbolForTestnet)
      default:
        return new TokenMetaUtil(tokensBySymbol)
    }
  }
}
