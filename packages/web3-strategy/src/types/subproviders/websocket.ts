declare class WebsocketProvider {
  constructor(options: { rpcUrl: string })

  public handleRequest(
    payload: never,
    next: never,
    end: (err?: Error, data?: never) => void,
  ): void
}

declare module 'web3-provider-engine/subproviders/websocket' {
  export = WebsocketProvider
}
