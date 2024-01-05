import { Network, isTestnet } from '@injectivelabs/networks'
import { TokenMetaUtils } from './TokenMetaUtils'
import {
  getTokensBySymbolForDevnet,
  getTokensBySymbolForDevnet1,
  getTokensBySymbolForDevnet2,
  getTokensBySymbolForTestnet,
} from './tokens/network'
import tokensBySymbol from './tokens/tokens'

export class TokenMetaUtilsFactory {
  static make(network: Network = Network.Mainnet): TokenMetaUtils {
    if (isTestnet(network)) {
      return new TokenMetaUtils(getTokensBySymbolForTestnet())
    }

    if (network === Network.Devnet) {
      return new TokenMetaUtils(getTokensBySymbolForDevnet())
    }

    if (network === Network.Devnet1) {
      return new TokenMetaUtils(getTokensBySymbolForDevnet1())
    }

    if (network === Network.Devnet2) {
      return new TokenMetaUtils(getTokensBySymbolForDevnet2())
    }

    return new TokenMetaUtils(tokensBySymbol)
  }
}
