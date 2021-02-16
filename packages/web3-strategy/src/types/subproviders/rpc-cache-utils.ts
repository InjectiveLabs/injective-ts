declare class RpcCacheUtilsSubprovider {
  public handleRequest(
    payload: never,
    next: never,
    end: (err?: Error, data?: never) => void,
  ): void
}

declare module 'web3-provider-engine/subproviders/rpc-cache-utils' {
  export = RpcCacheUtilsSubprovider
}
