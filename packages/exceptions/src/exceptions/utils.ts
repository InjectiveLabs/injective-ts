import { ConcreteException } from "../exception"
import { Exception } from "../types"

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
      'BitGetException',
    ].includes(exception.constructor.name)
  ) {
    return true
  }

  return false
}
