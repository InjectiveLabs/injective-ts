import {
  Web3Exception,
  WalletException,
  TrezorException,
  BitGetException,
  LedgerException,
  GeneralException,
  MetamaskException,
  OkxWalletException,
  HttpRequestException,
  LedgerCosmosException,
  TrustWalletException,
  CosmosWalletException,
  TransactionException,
  GrpcUnaryRequestException,
} from './exceptions/exceptions/index.js'

export type ThrownException =
  | GrpcUnaryRequestException
  | HttpRequestException
  | Web3Exception
  | GeneralException
  | LedgerException
  | MetamaskException
  | TrustWalletException
  | OkxWalletException
  | TrezorException
  | CosmosWalletException
  | TransactionException
  | WalletException
  | LedgerCosmosException
  | BitGetException
