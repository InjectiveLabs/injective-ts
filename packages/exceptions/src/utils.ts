import type { ThrownException } from './types.js'
import type { Exception } from './exceptions/types/index.js'

export const THROWN_EXCEPTIONS = [
  'Web3Exception',
  'LedgerException',
  'TrezorException',
  'WalletException',
  'BitGetException',
  'GeneralException',
  'MetamaskException',
  'OkxWalletException',
  'HttpRequestException',
  'TransactionException',
  'TrustWalletException',
  'LedgerCosmosException',
  'CosmosWalletException',
  'GrpcUnaryRequestException',
  'TurnkeyWalletSessionException',
]

export const isThrownException = (
  exception: Error | Exception | ThrownException,
): boolean => {
  if (THROWN_EXCEPTIONS.includes(exception.constructor.name)) {
    return true
  }

  if (THROWN_EXCEPTIONS.includes(exception.name)) {
    return true
  }

  if (
    'errorClass' in exception &&
    THROWN_EXCEPTIONS.includes((exception as ThrownException).errorClass)
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
