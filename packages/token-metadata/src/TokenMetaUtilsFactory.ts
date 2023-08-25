import { Network, isTestnet } from '@injectivelabs/networks'
import { ExtendedTokenMetaUtils } from './ExtendedTokenMetaUtils'
import {
  getTokensBySymbolForDevnet,
  getTokensBySymbolForDevnet1,
  getTokensBySymbolForDevnet2,
  getTokensBySymbolForTestnet,
} from './tokens/network'
import tokensBySymbol from './tokens/tokens'

export class TokenMetaUtilsFactory {
  static make(network: Network = Network.Mainnet): ExtendedTokenMetaUtils {
    if (isTestnet(network)) {
      return new ExtendedTokenMetaUtils(getTokensBySymbolForTestnet())
    }

    if (network === Network.Devnet) {
      return new ExtendedTokenMetaUtils(getTokensBySymbolForDevnet())
    }

    if (network === Network.Devnet1) {
      return new ExtendedTokenMetaUtils(getTokensBySymbolForDevnet1())
    }

    if (network === Network.Devnet2) {
      return new ExtendedTokenMetaUtils(getTokensBySymbolForDevnet2())
    }

    return new ExtendedTokenMetaUtils(tokensBySymbol)
  }
}
