import type { Keplr as CosmosBrowserWallet } from '@keplr-wallet/types'
import { ChainId } from '@injectivelabs/ts-types'
import { PublicKey } from '@injectivelabs/sdk-ts'
import { Wallet } from '@injectivelabs/wallet-base'
import { capitalize } from '@injectivelabs/utils'
import { CosmosWalletException } from '@injectivelabs/exceptions'
import { CosmosWallet } from './../wallet.js'
import { cosmosWallets } from './../data/index.js'

export const isCosmosWalletInstalled = (wallet: Wallet) => {
  const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
    leap?: CosmosBrowserWallet
    keplr?: CosmosBrowserWallet
    ninji?: CosmosBrowserWallet
    oWallet?: CosmosBrowserWallet
  }

  switch (wallet) {
    case Wallet.Keplr:
      return $window.keplr !== undefined
    case Wallet.Ninji:
      return $window.ninji !== undefined
    case Wallet.Leap:
      return $window.leap !== undefined
    case Wallet.OWallet:
      return $window.oWallet !== undefined
    default:
      return false
  }
}

export const confirmCosmosAddress = async ({
  wallet,
  chainId,
  injectiveAddress,
}: {
  wallet: Wallet
  chainId: ChainId
  injectiveAddress: string
}) => {
  if (!cosmosWallets.includes(wallet)) {
    throw new CosmosWalletException(
      new Error(`Cosmos Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  const cosmosWallet = new CosmosWallet({ chainId, wallet })
  const key = await cosmosWallet.getKey()
  const publicKey = PublicKey.fromBase64(
    Buffer.from(key.pubKey).toString('base64'),
  )

  const { address: derivedAddress } = publicKey.toAddress()

  if (derivedAddress !== injectiveAddress) {
    throw new CosmosWalletException(
      new Error(
        `Connected ${capitalize(
          wallet,
        )} address is wrong. Please update Injective on ${capitalize(wallet)}.`,
      ),
    )
  }
}
