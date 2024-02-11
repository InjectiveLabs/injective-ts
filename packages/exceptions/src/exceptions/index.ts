import { GrpcUnaryRequestException } from './GrpcUnaryRequestException'
import { HttpRequestException } from './HttpRequestException'
import { Web3Exception } from './Web3Exception'
import { GeneralException } from './GeneralException'
import { LedgerException } from './LedgerException'
import { LedgerCosmosException } from './LedgerCosmosException'
import { MetamaskException } from './MetamaskException'
import { TrustWalletException } from './TrustWalletException'
import { OkxWalletException } from './OkxWalletException'
import { TrezorException } from './TrezorException'
import { CosmosWalletException } from './CosmosWalletException'
import { TransactionException } from './TransactionException'
import { WalletException } from './WalletException'
import { Exception } from '../types'
import { ConcreteException } from '../exception'

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

export const isThrownException = (exception: Error | Exception): boolean => {
  if (exception instanceof ConcreteException) {
    return true
  }

  if (
    [
      'GrpcUnaryRequestException',
      'HttpRequestException',
      'Web3Exception',
      'GeneralException',
      'LedgerException',
      'LedgerCosmosException',
      'MetamaskException',
      'TrezorException',
      'CosmosWalletException',
      'TransactionException',
      'WalletException',
      'TrustWalletException',
      'OkxWalletException',
    ].includes(exception.constructor.name)
  ) {
    return true
  }

  return false
}

export {
  Web3Exception,
  LedgerException,
  TrezorException,
  WalletException,
  GeneralException,
  MetamaskException,
  TransactionException,
  TrustWalletException,
  OkxWalletException,
  HttpRequestException,
  LedgerCosmosException,
  CosmosWalletException,
  GrpcUnaryRequestException,
}
