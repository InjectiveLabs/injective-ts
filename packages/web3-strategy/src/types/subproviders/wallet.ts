declare class WalletSubprovider {
  constructor(wallet: any, options: any)

  public handleRequest(
    payload: never,
    next: never,
    end: (err?: Error, data?: never) => void,
  ): void
}

declare module 'web3-provider-engine/subproviders/wallet' {
  export = WalletSubprovider
}
