interface RequestParams {
  jsonrpc?: '2.0'
  id?: number
  method: string
  params?: object
}

export interface WalletProvider {
  request: (chainId: string, args: RequestParams) => Promise<any>
  networks: any
}

declare global {
  interface Window {
    dapp: WalletProvider
  }
}
