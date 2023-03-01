import { Network } from '@injectivelabs/networks'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  getTokensBySymbolForDevnet,
  getTokensBySymbolForDevnet1,
  getTokensBySymbolForDevnet2,
  getTokensBySymbolForTestnet,
} from './tokens/network'
import tokensBySymbol from './tokens/tokens/index'

export class TokenMetaUtilsFactory {
  static make(network: Network = Network.Mainnet): TokenMetaUtils {
    switch (network) {
      case Network.Staging:
      case Network.Mainnet:
      case Network.MainnetK8s:
      case Network.MainnetLB:
      case Network.Local:
        return new TokenMetaUtils(tokensBySymbol)
      case Network.Devnet:
        return new TokenMetaUtils(getTokensBySymbolForDevnet())
      case Network.Devnet1:
        return new TokenMetaUtils(getTokensBySymbolForDevnet1())
      case Network.Devnet2:
        return new TokenMetaUtils(getTokensBySymbolForDevnet2())
      case Network.Testnet:
      case Network.TestnetOld:
      case Network.TestnetK8s:
        return new TokenMetaUtils(getTokensBySymbolForTestnet())
      default:
        return new TokenMetaUtils(tokensBySymbol)
    }
  }
}
