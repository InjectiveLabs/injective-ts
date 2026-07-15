interface BrowserEip1193ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

interface BrowserEip1193ProviderMessage {
  type: string
  data: unknown
}

interface BrowserEip1193ProviderInfo {
  chainId: string
}

interface BrowserEip1193RequestArguments {
  method: string
  params?: unknown[] | object
}

export interface BrowserEip1993Provider {
  on(
    event: 'connect',
    listener: (info: BrowserEip1193ProviderInfo) => void,
  ): void
  on(
    event: 'disconnect',
    listener: (error: BrowserEip1193ProviderRpcError) => void,
  ): void
  on(
    event: 'message',
    listener: (message: BrowserEip1193ProviderMessage) => void,
  ): void
  on(event: 'chainChanged', listener: (chainId: string) => void): void
  on(event: 'accountsChanged', listener: (accounts: string[]) => void): void
  on(event: string, listener: any): void
  once(event: string, listener: any): void
  removeListener(event: string, listener: any): void
  off(event: string, listener: any): void
  request(args: BrowserEip1193RequestArguments): Promise<unknown>
  removeAllListeners(): void
  providers?: BrowserEip1993Provider[]
  isTrust: boolean
  isKeplr: boolean
  isRabby: boolean
  isRainbow: boolean
  isPhantom: boolean
  isBitGet?: boolean
  isBitKeep?: boolean
  isMetaMask: boolean
  isOkxWallet: boolean
  isTrustWallet: boolean
}

// Use Omit to avoid conflict with viem's stricter Window.ethereum type
// and @keplr-wallet/types' Window.keplr type
export interface WindowWithEip1193Provider extends Omit<
  Window,
  'ethereum' | 'keplr'
> {
  rainbow: BrowserEip1993Provider
  rabby: BrowserEip1993Provider
  ethereum: BrowserEip1993Provider
  okxwallet: BrowserEip1993Provider
  providers: BrowserEip1993Provider[]
  trustWallet?: BrowserEip1993Provider
  bitkeep: { ethereum: BrowserEip1993Provider }
  phantom?: { ethereum?: BrowserEip1993Provider }
  keplr?: { ethereum?: BrowserEip1993Provider }
}

export interface EIP6963ProviderInfo {
  rdns: string
  uuid: string
  name: string
  icon: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: BrowserEip1993Provider
}

export type EIP6963AnnounceProviderEvent = {
  detail: EIP6963ProviderDetail
}
