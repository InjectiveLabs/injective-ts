import { BaseTurnkeyWalletStrategy } from './base.js'
import {
  TurnkeyProvider,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

export class TurnkeyOauthWalletStrategy extends BaseTurnkeyWalletStrategy {
  constructor(args: ConcreteEthereumWalletStrategyArgs) {
    super({
      ...args,
      provider: TurnkeyProvider.Google,
    })
  }
}
