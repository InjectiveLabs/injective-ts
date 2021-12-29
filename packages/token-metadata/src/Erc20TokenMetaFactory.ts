import { Network } from '@injectivelabs/networks'
import { Erc20TokenMeta } from './Erc20TokenMeta'
import { tokensBySymbol, tokensBySymbolForTestnet } from './tokens'

export class Erc20TokenMetaFactory {
  static make(network: Network = Network.MainnetOld): Erc20TokenMeta {
    switch (network) {
      case Network.Mainnet:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.MainnetOld:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.Devnet:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.Local:
        return new Erc20TokenMeta(tokensBySymbol)
      case Network.Testnet:
        return new Erc20TokenMeta(tokensBySymbolForTestnet)
      default:
        return new Erc20TokenMeta(tokensBySymbol)
    }
  }
}
