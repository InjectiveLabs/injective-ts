import { Exception } from './exceptions/types'

export const isThrownException = (exception: Error | Exception): boolean => {
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

export const formatNotificationDescription = (description: string) => {
  const DESCRIPTION_CHARACTER_LIMIT = 50

  if (description.length <= DESCRIPTION_CHARACTER_LIMIT) {
    return {
      description,
      tooltip: '',
    }
  }

  return {
    description: description.slice(0, DESCRIPTION_CHARACTER_LIMIT) + ' ...',
    tooltip: description,
  }
}
