import type {
  Web3Exception,
  WalletException,
  TrezorException,
  BitGetException,
  LedgerException,
  GeneralException,
  MetamaskException,
  OkxWalletException,
  HttpRequestException,
  TrustWalletException,
  TransactionException,
  LedgerCosmosException,
  CosmosWalletException,
  GrpcUnaryRequestException,
} from './exceptions/exceptions/index.js'

export type ThrownException =
  | Web3Exception
  | LedgerException
  | TrezorException
  | WalletException
  | BitGetException
  | GeneralException
  | MetamaskException
  | OkxWalletException
  | HttpRequestException
  | TrustWalletException
  | TransactionException
  | CosmosWalletException
  | LedgerCosmosException
  | GrpcUnaryRequestException
