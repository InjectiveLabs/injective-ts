export const BroadcastMode = {
  Block: 'block',
  Sync: 'sync',
  Async: 'async',
} as const

export type BroadcastMode = (typeof BroadcastMode)[keyof typeof BroadcastMode]

export const Wallet = {
  Leap: 'leap',
  Keplr: 'keplr',
  Ninji: 'ninji',
  Magic: 'magic',
  Rabby: 'rabby',
  Ledger: 'ledger',
  BitGet: 'BitGet',
  OWallet: 'owallet',
  Phantom: 'phantom',
  Rainbow: 'rainbow',
  Turnkey: 'turnkey',
  Metamask: 'metamask',
  KeplrEvm: 'keplr-evm',
  OkxWallet: 'okx-wallet',
  PrivateKey: 'private-key',
  TrustWallet: 'trust-wallet',
  TrezorBip32: 'trezor-bip32',
  TrezorBip44: 'trezor-bip44',
  Cosmostation: 'cosmostation',
  LedgerCosmos: 'ledger-cosmos',
  LedgerLegacy: 'ledger-legacy',
  WalletConnect: 'wallet-connect',
  CosmostationEth: 'cosmostation-eth',
  PrivateKeyCosmos: 'private-key-cosmos',
} as const

export type Wallet = (typeof Wallet)[keyof typeof Wallet]

export const MagicProvider = {
  Email: 'email',
  Apple: 'apple',
  Github: 'github',
  Google: 'google',
  Discord: 'discord',
  Twitter: 'twitter',
  Facebook: 'facebook',
} as const

export type MagicProvider = (typeof MagicProvider)[keyof typeof MagicProvider]

export const WalletDeviceType = {
  Mobile: 'mobile',
  Other: 'other',
  Browser: 'browser',
  Hardware: 'hardware',
} as const

export type WalletDeviceType =
  (typeof WalletDeviceType)[keyof typeof WalletDeviceType]

export const WalletEventListener = {
  AccountChange: 'account-change',
  ChainIdChange: 'chain-id-change',
} as const

export type WalletEventListener =
  (typeof WalletEventListener)[keyof typeof WalletEventListener]

export const EvmWalletProviderErrorCode = {
  InternalError: -32603,
  UserRejectedRequest: 4001,
  UnrecognizedChain: 4902,
} as const

export type EvmWalletProviderErrorCode =
  (typeof EvmWalletProviderErrorCode)[keyof typeof EvmWalletProviderErrorCode]

export const WalletAction = {
  GetChainId: 'get-chain-id',
  GetAccounts: 'get-accounts',
  GetNetworkId: 'get-network-id',
  SignArbitrary: 'sign-arbitrary',
  SignTransaction: 'sign-transaction',
  SendTransaction: 'send-transaction',
  SendEvmTransaction: 'send-evm-transaction',
  SignEvmTransaction: 'sign-evm-transaction',
  GetEvmTransactionReceipt: 'get-evm-transaction-receipt',
} as const

export type WalletAction = (typeof WalletAction)[keyof typeof WalletAction]

export const DEFAULT_BASE_DERIVATION_PATH = "m/44'/60'"
export const DEFAULT_NUM_ADDRESSES_TO_FETCH = 5
export const DEFAULT_ADDRESS_SEARCH_LIMIT = 100

export const TurnkeyProvider = {
  Sms: 'sms',
  Apple: 'apple',
  Email: 'email',
  Google: 'google',
  Twitter: 'twitter',
} as const

export type TurnkeyProvider =
  (typeof TurnkeyProvider)[keyof typeof TurnkeyProvider]

export type TurnkeyOAuthProvider =
  | typeof TurnkeyProvider.Apple
  | typeof TurnkeyProvider.Google
  | typeof TurnkeyProvider.Twitter

export const StrategyEventType = {
  ConnectionEnd: 'connection-end',
  ConnectionStart: 'connection-start',
  WalletSigningEnd: 'wallet-signing-end',
  WalletSigningStart: 'wallet-signing-start',
} as const

export const WalletConnectStrategyEventType = {
  WalletConnectSigningWithTxTimeout: 'signing-with-tx-timeout',
} as const

export const WalletStrategyEmitterEventType = {
  TransactionFail: 'transaction-fail',
  TransactionSigned: 'transaction-signed',
  TransactionSignStart: 'transaction-sign-start',
  TransactionBroadcastEnd: 'transaction-broadcast-end',
  TransactionBroadcastStart: 'transaction-broadcast-start',
  TransactionBroadcastSynced: 'transaction-broadcast-synced',
  TransactionPreparationEnd: 'transaction-preparation-end',
  TransactionPreparationStart: 'transaction-preparation-start',
  WalletStrategyDisconnect: 'wallet-strategy-disconnect',
} as const

export type StrategyEventType =
  | (typeof StrategyEventType)[keyof typeof StrategyEventType]
  | (typeof WalletConnectStrategyEventType)[keyof typeof WalletConnectStrategyEventType]

export type WalletStrategyEmitterEventType =
  | (typeof WalletStrategyEmitterEventType)[keyof typeof WalletStrategyEmitterEventType]
  | StrategyEventType

export type WalletStrategyEmitterEvents = {
  [K in WalletStrategyEmitterEventType]: Record<string, any>
}

export interface WalletStrategyEmitter {
  on(
    event: WalletStrategyEmitterEventType,
    listener: (...args: any[]) => void,
  ): this
  off(
    event: WalletStrategyEmitterEventType,
    listener: (...args: any[]) => void,
  ): this
  emit(event: WalletStrategyEmitterEventType, ...args: any[]): boolean
}

export interface BrowserEip1193Provider {
  removeAllListeners(): void
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
  on(event: string, listener: (...args: unknown[]) => void): void
  removeListener(event: string, listener: (...args: unknown[]) => void): void
  providers?: BrowserEip1193Provider[]
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

export type BrowserEip1993Provider = BrowserEip1193Provider

export interface WindowWithEip1193Provider extends Omit<
  Window,
  'ethereum' | 'keplr'
> {
  rainbow: BrowserEip1193Provider
  rabby: BrowserEip1193Provider
  ethereum: BrowserEip1193Provider
  okxwallet: BrowserEip1193Provider
  providers: BrowserEip1193Provider[]
  trustWallet?: BrowserEip1193Provider
  bitkeep: { ethereum: BrowserEip1193Provider }
  phantom?: { ethereum?: BrowserEip1193Provider }
  keplr?: { ethereum?: BrowserEip1193Provider }
}

export interface EIP6963ProviderInfo {
  rdns: string
  uuid: string
  name: string
  icon: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: BrowserEip1193Provider
}

export type EIP6963AnnounceProviderEvent = {
  detail: EIP6963ProviderDetail
}

const evmWallets = [
  Wallet.Magic,
  Wallet.Rabby,
  Wallet.BitGet,
  Wallet.Ledger,
  Wallet.Phantom,
  Wallet.Rainbow,
  Wallet.Turnkey,
  Wallet.Metamask,
  Wallet.KeplrEvm,
  Wallet.OkxWallet,
  Wallet.PrivateKey,
  Wallet.TrezorBip32,
  Wallet.TrezorBip44,
  Wallet.TrustWallet,
  Wallet.LedgerLegacy,
  Wallet.WalletConnect,
  Wallet.CosmostationEth,
] as Wallet[]

const evmBrowserWallets = [
  Wallet.Rabby,
  Wallet.BitGet,
  Wallet.Phantom,
  Wallet.Rainbow,
  Wallet.Metamask,
  Wallet.KeplrEvm,
  Wallet.OkxWallet,
  Wallet.TrustWallet,
] as Wallet[]

const cosmosBrowserWallets = [
  Wallet.Leap,
  Wallet.Keplr,
  Wallet.Ninji,
  Wallet.OWallet,
  Wallet.Cosmostation,
] as Wallet[]

const eip712V2OnlyWallets = [
  Wallet.Magic,
  Wallet.Phantom,
  Wallet.Metamask,
  Wallet.WalletConnect,
] as Wallet[]

export const isEvmWallet = (wallet: Wallet): boolean =>
  evmWallets.includes(wallet)

export const isCosmosWallet = (wallet: Wallet): boolean => !isEvmWallet(wallet)

export const isEvmBrowserWallet = (wallet: Wallet): boolean =>
  evmBrowserWallets.includes(wallet)

export const isCosmosBrowserWallet = (wallet: Wallet): boolean =>
  cosmosBrowserWallets.includes(wallet)

export const isEip712V2OnlyWallet = (wallet: Wallet): boolean =>
  eip712V2OnlyWallets.includes(wallet)

export const isCosmosAminoOnlyWallet = (wallet: Wallet): boolean =>
  wallet === Wallet.LedgerCosmos

export type {
  MagicMetadata,
  WalletMetadata,
  TurnkeySession,
  WalletStrategy,
  Eip1193Provider,
  StrategyEmitter,
  TurnkeyMetadata,
  PrivateKeyMetadata,
  WalletConnectMetadata,
  ConcreteStrategiesArg,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  CosmosWalletAbstraction,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  WalletStrategyEvmOptions,
  ConcreteWalletStrategyArgs,
  ConcreteCosmosWalletStrategy,
  ConcreteEvmWalletStrategyArgs,
  ConcreteCosmosWalletStrategyArgs,
  WalletStrategy as WalletStrategyInterface,
} from './types/strategy.js'
