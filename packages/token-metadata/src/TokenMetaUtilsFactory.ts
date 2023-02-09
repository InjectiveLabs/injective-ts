import { Network } from '@injectivelabs/networks'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  tokensBySymbolForDevnet,
  tokensBySymbolForDevnet1,
  tokensBySymbolForDevnet2,
  tokensBySymbolForTestnet,
} from './tokens/network'
import tokensBySymbol from './tokens/tokens/index'

export class TokenMetaUtilsFactory {
  static make(network: Network = Network.Mainnet): TokenMetaUtils {
    switch (network) {
      case Network.Mainnet:
      case Network.MainnetK8s:
      case Network.MainnetLB:
      case Network.Local:
        return new TokenMetaUtils(tokensBySymbol)
      case Network.Devnet:
        return new TokenMetaUtils(tokensBySymbolForDevnet)
      case Network.Devnet1:
        return new TokenMetaUtils(tokensBySymbolForDevnet1)
      case Network.Devnet2:
        return new TokenMetaUtils(tokensBySymbolForDevnet2)
      case Network.Testnet:
      case Network.TestnetOld:
      case Network.TestnetK8s:
        return new TokenMetaUtils(tokensBySymbolForTestnet)
      default:
        return new TokenMetaUtils(tokensBySymbol)
    }
  }
}
