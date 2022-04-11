import { Network } from '@injectivelabs/networks'
import { Erc20TokenMeta } from './Erc20TokenMeta'
import {
  tokensBySymbol,
  tokensBySymbolForDevnet,
  tokensBySymbolForDevnet1,
  tokensBySymbolForTestnet,
} from './tokens'

export class Erc20TokenMetaFactory {
  static make(network: Network = Network.MainnetOld): Erc20TokenMeta {
    switch (network) {
      case Network.Mainnet:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.MainnetOld:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.MainnetK8s:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.MainnetStaging:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.Devnet:
        return new Erc20TokenMeta(tokensBySymbolForDevnet)
      case Network.Devnet1:
        return new Erc20TokenMeta(tokensBySymbolForDevnet1)
      case Network.Local:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.Testnet:
        return new Erc20TokenMeta(tokensBySymbolForTestnet)
      case Network.TestnetK8s:
        return new Erc20TokenMeta(tokensBySymbolForTestnet)
      default:
        return new Erc20TokenMeta(tokensBySymbol)
    }
  }
}
