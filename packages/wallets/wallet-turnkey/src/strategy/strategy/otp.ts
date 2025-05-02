import { BaseTurnkeyWalletStrategy } from './base.js'
import { ConcreteEthereumWalletStrategyArgs, TurnkeyProvider } from '@injectivelabs/wallet-base'

export class TurnkeyOtpWalletStrategy extends BaseTurnkeyWalletStrategy {
  constructor(args: ConcreteEthereumWalletStrategyArgs) {
    super({
      ...args,
      provider: TurnkeyProvider.Email,
    })
  }
}
