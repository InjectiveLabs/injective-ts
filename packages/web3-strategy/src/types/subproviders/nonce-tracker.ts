declare class NonceTrackerSubprovider {
  public handleRequest(
    payload: never,
    next: never,
    end: (err?: Error, data?: never) => void,
  ): void
}

declare module 'web3-provider-engine/subproviders/nonce-tracker' {
  export = NonceTrackerSubprovider
}
