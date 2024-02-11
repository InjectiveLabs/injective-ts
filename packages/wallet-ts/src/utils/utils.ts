import { getEthereumAddress, getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { Wallet } from '../types'
import {
  ErrorType,
  GeneralException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { BrowserEip1993Provider } from '../strategies'

export const getInjectiveSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('inj')) {
    return address
  }

  if (address.startsWith('0x')) {
    return getInjectiveAddress(address)
  }

  return ''
}

export const getEthereumSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('0x')) {
    return address
  }

  if (address.startsWith('inj')) {
    return getEthereumAddress(address)
  }

  return ''
}

export const checkCorrectWalletProvider = (
  provider: BrowserEip1993Provider,
  wallet: Wallet,
) => {
  switch (wallet) {
    case Wallet.Metamask: {
      if (
        !provider.isMetaMask ||
        provider.isTrustWallet ||
        provider.isOkxWallet ||
        provider.isPhantom
      ) {
        throw new GeneralException(
          new Error(
            'You are connected to the wrong wallet. Please use Metamask.',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
          },
        )
      }

      return
    }
    case Wallet.Phantom: {
      if (
        !provider.isPhantom ||
        provider.isMetaMask ||
        provider.isOkxWallet ||
        provider.isTrustWallet
      ) {
        throw new GeneralException(
          new Error(
            'You are connected to the wrong wallet. Please use Trust Wallet.',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
          },
        )
      }

      return
    }
    case Wallet.Okx: {
      if (
        !provider.isOkxWallet ||
        provider.isMetaMask ||
        provider.isTrustWallet ||
        provider.isPhantom
      ) {
        throw new GeneralException(
          new Error(
            'You are connected to the wrong wallet. Please use Okx Wallet.',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
          },
        )
      }

      return
    }
    case Wallet.TrustWallet: {
      if (
        !provider.isTrustWallet ||
        provider.isMetaMask ||
        provider.isOkxWallet ||
        provider.isPhantom
      ) {
        throw new GeneralException(
          new Error(
            'You are connected to the wrong wallet. Please use Trust Wallet.',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
          },
        )
      }

      return
    }
    default: {
      //
    }
  }
}
